'use strict';

var tap = require('tap');
var request = require('request')
var assert = require('assert');
var server = require("../Server.js");

var runningSrv = null;

// Using https://www.node-tap.org/api/

var createStreamParams = function(user) {
	return { method: 'POST', 
			uri: 'http://localhost:9000/stream/' + user,
			headers: [{
	          name: 'content-type',
	          value: 'application/json'
	        }, {
	          name: 'accept',
	          value: 'application/json'
	      	}]
	      };
};

var keepaliveStreamParams = function(user, streamid) {
	return { method: 'PUT', 
			uri: 'http://localhost:9000/stream/' + user + "/" + streamid,
			headers: [{
	          name: 'content-type',
	          value: 'application/json'
	        }, {
	          name: 'accept',
	          value: 'application/json'
	      	}]
	      };
};

var deleteStreamParams = function(user, streamid) {
	return { method: 'DELETE', 
			uri: 'http://localhost:9000/stream/' + user + "/" + streamid,
			headers: [{
	          name: 'content-type',
	          value: 'application/json'
	        }, {
	          name: 'accept',
	          value: 'application/json'
	      	}]
	      };
};

var testStreamApi = function(id, test, payload) {
	test.test('Invoke Stream API: '+id, function(t2){
		console.log("Sending request");
		// An object of options to indicate where to post to
  		request(payload, function(err, res, body){
  			if(err) {
  				console.log(err);
  				t2.fail("errors");
  				t2.end();
  			}
  			else{
	  			t2.equal(res.statusCode, 200, "StatusCode is not 200");
	  			t2.pass("success");
	  			t2.end();
  			}
  		});
	});
}


tap.test('Starting server', function (t1) {
	console.log("Waiting for the server to come up");
	server.startServer().then(function(srv){
		console.log("Server up and running");
		runningSrv = srv;
		t1.pass("server can start");
		t1.end();
	});
	tap.pass();
});

tap.test('Swagger end-to-end testing', function (t1) {

	t1.test('Create a Stream', function(t2){
		testStreamApi('first create', t2, createStreamParams("fakeuser"));
		testStreamApi('second create', t2, createStreamParams("fakeuser"));
		testStreamApi('third create', t2, createStreamParams("fakeuser"));
		t2.test('Fail if more than 3 streams', function(t3){
			// An object of options to indicate where to post to
	  		request(createStreamParams("fakeuser"), function(err, res, body){
	  			if(err) {
	  				console.log(err);
	  				t3.fail(err);
	  			}
	  			t3.equal(res.statusCode, 400, "StatusCode is not 400");
	  			t3.pass("success");
	  			t3.end();
	  		});
	  		t2.pass();
	  		t2.end();
		});
	});
	t1.test('Keepalive a Stream', function(t2){
		// Test that at the beginning we don't have a stream
		request(keepaliveStreamParams("fakekauser", "anything"), function(err, res, body){
  			if(err) console.log(err);
  			t2.equal(res.statusCode, 400, "StatusCode is not 400");
  			t2.pass("success");
		});	
		server.setKeepAliveTimeout(500);
		console.log("Sending a PUT request");
		// An object of options to indicate where to post to
  		request(createStreamParams("fakekauser"), function(err, res, body){
  			if(err) {
  				console.log(err);
  				t2.fail(err);
  			}
  			var id = JSON.parse(body).id;
  			t2.equal(res.statusCode, 200, "StatusCode is not 200");
  			// The keepalive of a created stream should work
  			testStreamApi("firstKeepAlive", t2, keepaliveStreamParams("fakekauser", id));
  			// The keepalive should work if before the timeout
  			testStreamApi("secondKeepAlive", t2, keepaliveStreamParams("fakekauser", id));
  			// The keepalive should not work after the timeout
  			setTimeout(function(){
  				request(keepaliveStreamParams("fakekauser", id), function(err2, res2, body){
		  			if(err2) console.log(err2);
		  			t2.equal(res2.statusCode, 400, "StatusCode is not 400");
		  			t2.pass("success");
		  			t2.end();
	  			});
  			}, 600);
  		});
	});

	t1.test('Delete a Stream', function(t2){
		// Test that at the beginning we don't have a stream
		request(deleteStreamParams("fakedeluser", "anything"), function(err, res, body){
  			if(err) console.log(err);
  			t2.equal(res.statusCode, 400, "StatusCode is not 400");
  			t2.pass("success");
		});	
		// An object of options to indicate where to post to
  		request(createStreamParams("fakedeluser"), function(err, res, body){
  			if(err) {
  				console.log(err);
  				t2.fail(err);
  			}
  			t2.equal(res.statusCode, 200, "StatusCode is not 200");
  			var id = JSON.parse(body).id;
  			// The delete of a created stream should work
  			testStreamApi("delsuccess", t2, deleteStreamParams("fakedeluser", id));
  			// The delete should not work after being already deleted
			request(deleteStreamParams("fakedeluser", id), function(err2, res2, body){
	  			if(err2) console.log(err2);
	  			t2.equal(res2.statusCode, 400, "StatusCode is not 400");
	  			t2.pass("success");
	  			t2.end();
  			});
  		});
	});
	t1.pass("great test");
	t1.end();
});

tap.test('Stopping server', function (t1) {
	console.log("Waiting for the server to shutdown");
		runningSrv.close();
		runningSrv = {};
		console.log("Server down");
		t1.pass("server can start");
		t1.end();
	tap.pass();
	tap.end();
});

