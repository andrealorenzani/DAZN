'use strict';

// Uses http://sinonjs.org/releases/v6.1.3/

var tap = require('tap');
var sinon = require('sinon');

var expResOpenStream = { id : "mywonderfulid" };
var expRes4Streams = { code: "01", message: "exception" };
var expResKeepAlive = { code: "02", message: "exception" };
var expResDel = { code: "03", message: "exception" };
var toString = function(payload){
	return JSON.stringify(payload);
}

var isFailure = false;

var fakeFunReturn = function(){
	if(isFailure) throw("exception");
	else return "mywonderfulid";
}

var fakeFun = function(){
	if(isFailure) throw("exception");
}

var dao = require("../dao/dao-loki.js");
sinon.stub(dao, 'updateLastAlive').callsFake(fakeFun);
sinon.stub(dao, 'remove').callsFake(fakeFun);
sinon.stub(dao, 'createStream').callsFake(fakeFunReturn);
var service = require('../service/StreamService.js');


tap.test('StreamService testing', function (t1) {
	t1.test('openStream', function(t2){
		isFailure=false;
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
		service.openStream('user').then(function(res) {
			if(toString(res.body) === toString(expRes4Streams) &&
				res.code === 400){
				t2.pass("openStream failed properly");
			}
			else{
				t2.fail("The error system is not working properly");
			}
			t2.end();
		})
	});
	t1.test('keepalive', function(t2){
		isFailure=false;
		service.keepaliveStream('user', 'id').then(function(res) {
			if(res.body == null){
				t2.pass("keepAlive successful");
			}
			else{
				t2.fail("Some unexpected result during keepalive");
			}
			t2.end();
		})
	});
	t1.test('keepalive in error', function(t2){
		isFailure=true;
		service.keepaliveStream('user', 'id').then(function(res) {
			if(toString(res.body) === toString(expResKeepAlive) &&
				res.code === 400){
				t2.pass("Keepalive failed properly");
			}
			else{
				t2.fail("Something wrong in the failure of keepalive");
			}
			t2.end();
		})
	});
	t1.test('delete', function(t2){
		isFailure=false;
		service.delStream('user', 'id').then(function(res) {
			if(res.body == null){
				t2.pass("We deleted");
			}
			else{
				t2.fail("Some unexpected results during delete");
			}
			t2.end();
		})
	});
	t1.test('delete in error', function(t2){
		isFailure=true;
		service.delStream('user', 'id').then(function(res) {
			if(toString(res.body) === toString(expResDel) &&
				res.code === 400){
				t2.pass("Delete failed properly");
			}
			else{
				t2.fail("Failure system for delete is not working as expected");
			}
			t2.end();
		})
	});
	t1.pass();
	t1.end();
});