/* jshint node: true, esversion: 6 */

'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    expressSession = require('express-session');

var app = express();

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
var fs = require('fs'),
    https = require('https');

var server = https.createServer({
    key: fs.readFileSync('./ssl/my.key'),
    cert: fs.readFileSync('./ssl/my.crt')
}, app);

// parametry aplikacji
var port = process.env.PORT || 3000,
    secret = require('./config').secret;

// Middlewares
app.use(bodyParser.json());
app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));


// Static resources
app.use(serveStatic('templates'));
app.use(serveStatic('assets'));
app.use(serveStatic('bower_components'));

// REST api
app.use('/api/persons', require('./controllers/api/persons'));
app.use('/api/horses', require('./controllers/api/horses'));
app.use('/api/contests', require('./controllers/api/contests'));
app.use('/api/sessions', require('./controllers/api/sessions'));
app.use('/', require('./controllers/static'));

// TODO: in production listen on https instead of app
app.listen(port, function () {
  console.log('Serwer nasłuchuje na porcie ' + port);
});
