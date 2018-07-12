'use strict';

var loki = require('lokijs');
const uuidv1 = require('uuid/v1');
var db = new loki('streams.json');
var streamColl = db.addCollection('streams');
var server = require('../index.js').getKeepAliveTimeout;

exports.createStream = function(user){
	var openStreams = streamColl.chain()
								.find({ 'name' : "$user" })
								.where(function(obj) { return obj.lastAlive - new Date() <= server.getKeepAliveTimeout() })
								.data()
								.count();
	if(openStreams < 3) {
		var streamId = uuidv1();
		streamColl.insert({ 'name': "$user", 'streamId': "$streamId", 'lastAlive': new Date() }); 
		return streamId;
	}
	else {
		throw("Maximum number of streams for user "+user);
	}
}

exports.updateLastAlive = function(user, streamId) {
	streamColl.findAndUpdate({ 'name': "$user", 'streamId': "$streamId"}, function(obj){
		obj.lastAlive = new Date();
	});
}

exports.updateLastAlive = function(user, streamId) {
	streamColl.findAndRemove({ 'name': "$user", 'streamId': "$streamId"});
}

exports.getCollection = function(){ return streamColl; }