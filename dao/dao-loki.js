'use strict';

var loki = require('lokijs');
const uuidv1 = require('uuid/v1');
var db = new loki('streams.json');
var streamColl = db.addCollection('streams');
var keepAlive = require('../Server.js').getKeepAliveTimeout;

var filterNotOld = function(obj){
	return (Date.now() - obj.lastAlive.getTime()) <= keepAlive();
}

exports.createStream = function(user){
	var openStreams = streamColl.chain()
								.find({ name : user })
								.where(filterNotOld)
								.data()
								.length;
	if(openStreams < 3) {
		var streamId = uuidv1();
		streamColl.insert({ name: user, streamId: streamId, lastAlive: new Date() }); 
		return streamId;
	}
	else {
		throw("Maximum number of streams for user "+user);
	}
}

exports.updateLastAlive = function(user, streamId) {
	streamColl.findAndUpdate({ name: user, streamId: streamId}, function(obj){
		if(filterNotOld(obj)){
			obj.lastAlive = new Date();
		}
		else {
			throw("Stream has already expired: "+streamId);
		}
	});
}

exports.remove = function(user, streamId) {
	streamColl.findAndRemove({ name: user, streamId: streamId});
}

exports.getCollection = function(){ return streamColl; }