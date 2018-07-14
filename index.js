'use strict';

var serverLib = require("./Server.js");

var server = {};
serverLib.startServer().then(function(srv){
	server = srv;
});