'use strict';

// https://medium.com/@tech_fort/an-introduction-to-lokijs-the-idiomatic-way-d24a4c546f7

var server = require("../index.js");
var tap = require('tap');
var db = require('../dao/dao-loki.js');
var assert = require('assert');

/*tap.beforeEach(function (done) {
	console.log("Clearing the database");
	db.getCollection().clear();
	done();
});*/

tap.test('Database (loki) testing', function (t1) {
	t1.test('Insertion', function (t2) {
		db.createStream("user");
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
	t1.pass("Tests pass");
	t1.end();
});