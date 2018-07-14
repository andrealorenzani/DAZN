'use strict';

var utils = require('../utils/writer.js');
var Stream = require('../service/StreamService');

module.exports.delStream = function delStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var streamId = req.swagger.params['streamId'].value;
  console.log("Invoking delStream for userId ["+userId+"] and streamId ["+streamId+"]");
  Stream.delStream(userId,streamId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
      console.log("Invoked delStream for userId ["+userId+"] and streamId ["+streamId+"]");
    })
    .catch(function (response) {
      utils.writeJson(res, { code: "99", message: response}, 500);
      console.log("Error in delStream for userId ["+userId+"] and streamId ["+streamId+"]: "+response);
    });
};

module.exports.keepaliveStream = function keepaliveStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var streamId = req.swagger.params['streamId'].value;
  console.log("Invoking keepaliveStream for userId ["+userId+"] and streamId ["+streamId+"]");
  Stream.keepaliveStream(userId,streamId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
      console.log("Invoked keepaliveStream for userId ["+userId+"] and streamId ["+streamId+"]");
    })
    .catch(function (response) {
      utils.writeJson(res, { code: "99", message: response}, 500);
      console.log("Error in keepaliveStream for userId ["+userId+"] and streamId ["+streamId+"]: "+response);
    });
};

module.exports.openStream = function openStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  console.log("Invoking openStream for userId ["+userId+"]");
  Stream.openStream(userId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
      console.log("Invoked openStream for userId ["+userId+"]");
    })
    .catch(function (response) {
      utils.writeJson(res, { code: "99", message: response}, 500);
      console.log("Error in openStream for userId ["+userId+"]: "+response);
    });
};
