/* jshint node: true */
"use strict";

var jwt = require('jwt-simple'),
    config = require('./config'),
    Person = require('./models/person.js');

var authenticateClient = function (token, socket, callback) {
  var auth;
  try {
    auth = jwt.decode(token, config.secret);
    if (typeof auth.role === 'string' && (auth.role === 'admin' || auth.role === 'refree')) {
      Person.findOne({ username: auth.username, role: auth.role })
      .select('username')
      .select('role')
      .exec(function (err, user) {
        auth = {};
        if (err) {
          console.log('WS: connection closed: database error');
          socket.disconnect('unauthorized');
          return auth;
        }
        auth = {
          username: user.username,
          role: user.role,
          isAdmin: function () {
            return this.role === 'admin';
          },
          isRefree: function () {
            return this.role === 'refree';
          }
        };
        callback(auth);
      });
    }
  } catch (e) {
    console.log('WS: connection closed: invalid token');
    return auth;
  }
};

exports.ensureToken = function (socket, next) {
  var token, auth;
  if (!socket.handshake.query.token) {
    console.log("WS: Token has not been supplied.");
    return;
  }
  token = socket.handshake.query.token;
  console.log('WS token: ' + token);
  next();
};

exports.init = function(io) {
  return {
    channels: {
      main: io.of('/main')
        .on('connection', function (socket) {
          authenticateClient(socket.handshake.query.token, socket, function (auth) {
            console.log(auth.role + ' has connected to main channel');
            socket.on('main:message', function (data) {
              console.log('/main:\n' + JSON.stringify(data, null, 2));
            });
            socket.on('main:startContest', function (data) {
              if (auth.isAdmin()) {
                console.log('admin started a contest');
              }
            });
          });
        })
    }
  };
};
