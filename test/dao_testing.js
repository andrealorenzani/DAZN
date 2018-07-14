'use strict';

// https://medium.com/@tech_fort/an-introduction-to-lokijs-the-idiomatic-way-d24a4c546f7

var tap = require('tap');
var assert = require('assert');
var server = require("../Server.js");
server.setKeepAliveTimeout(100);
var db = require('../dao/dao-loki.js');

tap.beforeEach(function (done) {
	console.log("Clearing the database");
	db.getCollection().clear();
	done();
});

tap.test('Database (loki) testing', function (t1) {
	db.getCollection().clear();
	t1.test('Insertion', function (t2) {
		if(db.createStream("user")){
			t2.pass("Created element");
		}
		else {
			t2.fail("Unable to create streams");
		}
		db.createStream("user");
		db.createStream("user");
		t2.pass("Created 3 streams");
		try{
			db.createStream("user");
			t2.fail("Constraint violated: 3 streams max");
		}
		catch(ex){
			t2.equal(ex, "Maximum number of streams for user user", "Maximum of 3 streams violated")
			t2.pass("Constraint: 3 streams max")
		}
		t2.end();
	});

	t1.test('Keep alive', function (t2) {
		var id = db.createStream("user");
		try{
			db.updateLastAlive("user", id);
			t2.pass("Updated the keepalive"); 
		}
		catch(ex) {
			t2.fail("Error in updating the keepalive: "+ex);
		}
		db.updateLastAlive("user", id);
		setTimeout(function(){
			try{
				db.updateLastAlive("user", id);
				t2.fail("Updated the keepalive working after timeout"); 
			}
			catch(ex) {
				t2.equal(ex, "Stream has already expired: "+id, "The update of KeepAlive has thrown a different exception: "+ex);
				t2.pass("The stream has expired");
				db.createStream("user");
				db.createStream("user");
				db.createStream("user");
				t2.pass("After expires I can recreate 3 streams");
			}
			t2.end();
		}, 200);
	});

	t1.test('Delete', function (t2) {
		var id = db.createStream("user");
		db.remove("user", id);
		t2.pass("Can delete");
		try{
			db.updateLastAlive("user", id); 
			t2.fail("Should not update");
		}
		catch(ex) {
			t2.pass("The stream has been removed");
		}
		try{
			db.remove("user", id); 
			t2.fail("Should not remove");
		}
		catch(ex) {
			t2.pass("The stream has been removed");
		}
		id = db.createStream("user");
		db.createStream("user");
		db.createStream("user");
		t2.pass("Can create 3 stream after a delete");
		setTimeout(function(){
			db.remove("user", id);
			t2.pass("Can delete after keepalive expires");
			db.createStream("user");
			db.createStream("user");
			db.createStream("user");
			t2.pass("After expires it can recreate 3 streams");
			t2.end();
		}, 200);
	});
	t1.pass("Tests pass");
	t1.end();
});