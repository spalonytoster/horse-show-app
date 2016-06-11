/* jshint node: true */
"use strict";

var jwt = require('jwt-simple'),
    config = require('./config'),
    Person = require('./models/person.js');

exports.authenticateWS = function (socket, next) {
  var token, auth;
  if (!socket.handshake.query) {
    // next(new Error("Token has not been supplied."));
    next();
  }
  token = socket.handshake.query.token;
  console.log('WS token: ' + token);
  try {
    auth = jwt.decode(token, config.secret);
    if (typeof auth.role === 'string' && (auth.role === 'admin' || auth.role === 'refree')) {
      Person.findOne({ username: auth.username, role: auth.role })
      .select('username')
      .select('role')
      .exec(function (err, user) {
        if (err) { return next(); }
        socket.auth = auth;
      });
    }
  } catch (e) {
    console.log('invalid token');
  }
  next();
};

exports.init = function(io) {
  return {
    channels: {
      main: io.of('/main')
        .on('connection', function (socket) {
          if (!socket.auth) {
            console.log('connection closed: unauthorized');
            return socket.disconnect('unauthorized');
          }
          console.log('someone has connected to main channel');
          socket.on('main:message', function (data) {
            console.log('/main:\n' + JSON.stringify(data, null, 2));
          });
          socket.on('main:startContest', function (data) {
            if (true) {

            }
            console.log('test: ' + data);
          });
        })
    }
  };
};
