'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://"+process.env.MONGO_HOST+":27017/test";
const uuidv1 = require('uuid/v1');
var keepAlive = require('../Server.js').getKeepAliveTimeout;

var filterNotOld = function(obj){
	return (Date.now() - obj.lastAlive.getTime()) <= keepAlive();
}
var throwErr = function(db, err){
	try { db.close(); }
	catch(ex) {}
	throw err;
}

var countElements = function(filterJson, whereClause = noFilter){
	return streamColl.chain()
				.find(filterJson)
				.where(whereClause)
				.data()
				.length;
}

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  console.log("Connecting to: '"+url+"'");
  if (err) throw err;
  var dbo = db.db("streams");
  dbo.createCollection("streams", function(err, res) {
    if (err) throw err;
    db.close();
  });
});

exports.createStream = function(user){
	var streamId = uuidv1();
	return new Promise(function (resolve, reject) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err; 
			var dbo = db.db("streams");
			var notBefore = new Date(Date.now() - keepAlive());
			dbo.collection("streams").find({ name: user, lastAlive: { $gte: notBefore} }).toArray(function(err, result) {
				if (err) throwErr(db, err);
				if (result.length >= 3) throwErr(db, "Maximum number of streams for user "+user);
				var myobj = { name: user, streamId: streamId, lastAlive: new Date() };
				dbo.collection("streams").insertOne(myobj, function(err, res) {
					if (err) throwErr(db, err);
					db.close();
					resolve(streamId);
				});
			});
		});
	});
}


exports.updateLastAlive = function(user, streamId) {
	return new Promise(function (resolve, reject) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) {
				db.close();
				reject(err);
			}
			var dbo = db.db("streams");
			var getStream = { name: user, streamId: streamId };
			dbo.collection("streams").findOne(getStream, function(err, result) {
				var exception = null;
				if (err) exception = err;
				if (!result) exception = "No stream '"+streamId+"' for user '"+user+"'";
				if (!filterNotOld(result[0])) exception = "Stream has already expired: '"+streamId;
				if(exception!=null){
					db.close();
					reject(exception);
				}
				else{
					dbo.collection("streams").updateOne(getStream, {lastAlive: new Date()}, function(err, res) {
						db.close();
						if (err) reject(err);
						else resolve();
					});
				}
			});
		});
	});
}

exports.remove = function(user, streamId) {
	return new Promise(function (resolve, reject) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) {
				db.close();
				reject(err);
			};
			var dbo = db.db("streams");
			var getStream = { name: user, streamId: streamId };
			dbo.collection("streams").findOne(getStream, function(err, result) {
				var exception = null;
				if (err) exception = err;
				if (!result) exception = "No stream '"+streamId+"' for user '"+user+"'";
				if(exception != null){
					db.close();
					reject(exception);
				}
				else {
					dbo.collection("streams").deleteOne(getStream, function(err, res) {
						db.close();
						if(err) reject(err);
						else resolve();
					});
				}
			})
		});
	});
}

exports.cleanDB = function(){
	return new Promise(function (resolve, reject) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("streams");
		  dbo.collection("streams").drop(function(err, delOK) {
		    if (err) reject(err);
		    if (delOK) console.log("Collection deleted");
		    resolve();
		    db.close();
		  });
		});
	});
}