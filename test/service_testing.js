'use strict';

// Uses http://sinonjs.org/releases/v6.1.3/

var tap = require('tap');
var sinon = require('sinon');

var expResOpenStream = { id : "mywonderfulid" };
var expRes4Streams = { code: "01", message: "exception" };
var toString = function(payload){
	return JSON.stringify(payload);
}

var isFailure = false;

var fakeFun = function(){
	if(isFailure) throw("exception");
	else return "mywonderfulid";
}

tap.test('StreamService testing', function (t1) {
	t1.test('openStream', function(t2){
		sinon.stub(require("../dao/dao-loki.js"), 'createStream').callsFake(fakeFun);
		var service = require('../service/StreamService.js');
		service.openStream('user').then(function(res) {
			if(toString(res.body) === toString(expResOpenStream)){
				t2.pass("Added value passed");
			}
			else{
				t2.fail("Error in adding streams");
			}
			t2.end();
		})
	});
	t1.test('openStream with 3 streams', function(t2){
		isFailure=true;
		var service = require('../service/StreamService.js');
		service.openStream('user').then(function(res) {
			console.log("Result: "+toString(res));
			if(toString(res.body) === toString(expRes4Streams) &&
				res.code === 400){
				t2.pass("Added value passed");
			}
			else{
				t2.fail("Error in adding streams");
			}
			t2.end();
		})
	});
	t1.pass();
	t1.end();
});