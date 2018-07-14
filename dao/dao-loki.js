'use strict';

var loki = require('lokijs');
const uuidv1 = require('uuid/v1');
var db = new loki('streams.json');
var streamColl = db.addCollection('streams');
var keepAlive = require('../Server.js').getKeepAliveTimeout;

var filterNotOld = function(obj){
	return (Date.now() - obj.lastAlive.getTime()) <= keepAlive();
}
var noFilter = function(obj){
	return true;
}

var countElements = function(filterJson, whereClause = noFilter){
	return streamColl.chain()
				.find(filterJson)
				.where(whereClause)
				.data()
				.length;
}

exports.createStream = function(user){
	var openStreams = countElements({ name : user }, filterNotOld);
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
	if(countElements({ name : user, streamId: streamId })<1){
		throw("No stream '"+streamId+"' for user '"+user+"'")
	}
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
	if(countElements({ name : user, streamId: streamId })<1){
		throw("No stream '"+streamId+"' for user '"+user+"'")
	}
	streamColl.findAndRemove({ name: user, streamId: streamId});
}

exports.getCollection = function(){ return streamColl; }