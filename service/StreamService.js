'use strict';


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
    resolve();
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
    var examples = {};
    examples['application/json'] = {
  "id" : "oenvpenivopwenvpwvprpntewp"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

