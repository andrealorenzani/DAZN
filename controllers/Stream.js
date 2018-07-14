'use strict';

var utils = require('../utils/writer.js');
var Stream = require('../service/StreamService');

module.exports.delStream = function delStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var streamId = req.swagger.params['streamId'].value;
  Stream.delStream(userId,streamId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response.body, response.code);
    });
};

module.exports.keepaliveStream = function keepaliveStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  var streamId = req.swagger.params['streamId'].value;
  Stream.keepaliveStream(userId,streamId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response.body, response.code);
    });
};

module.exports.openStream = function openStream (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  Stream.openStream(userId)
    .then(function (response) {
      utils.writeJson(res, response.body, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response.body, response.code);
    });
};
