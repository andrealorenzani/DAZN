'use strict';

var dao = require("../dao/dao-loki.js")

var createResp = function(status, payload){
  return { code: status, body: payload };
}
var createErrorMsg = function(errCode, msg, status=400){
  return createResp(status, { code: errCode, message: msg });
}
var createStreamDetail = function(id){
  return createResp(200, { id: id });
}


/**
 * Close one of the streams of the user
 * The stream for the user is explicitely close
 *
 * userId String The userId of the user that is closing the stream
 * streamId String The id of the stream that we want to close
 * no response value expected for this operation
 **/
exports.delStream = function(userId,streamId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Keepalive a stream
 * Set the active stream as alive
 *
 * userId String The userId of the user that has opened the stream
 * streamId String The id of the stream that is alive
 * no response value expected for this operation
 **/
exports.keepaliveStream = function(userId,streamId) {
  return new Promise(function(resolve, reject) {
    try{
      dao.updateLastAlive(userId, streamId);
      resolve(createResp(200, null));
    }
    catch(ex){
      resolve(createErrorMsg("02", ex));
    }
  });
}


/**
 * Open a new stream for the user
 * Open a new stream
 *
 * userId String The userId of the user that is opening the stream
 * returns StreamDetail
 **/
exports.openStream = function(userId) {
  return new Promise(function(resolve, reject) {
    try{
      var id = dao.createStream(userId);
      resolve(createStreamDetail(id));
    }
    catch(ex){
      console.log("error opening stream: "+ex);
      resolve(createErrorMsg("01", ex));
    }
  });
}

