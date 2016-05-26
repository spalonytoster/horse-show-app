/* jshint node: true, esversion: 6 */

'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static');

var app = express();

app.use(bodyParser.json());
app.use(serveStatic('templates'));
app.use(serveStatic('assets'));
app.use(serveStatic('bower_components'));

// Middlewares
// app.use(require('./auth'));

// REST api
app.use('/api/persons', require('./controllers/api/persons'));
app.use('/api/horses', require('./controllers/api/horses'));
app.use('/api/contests', require('./controllers/api/contests'));
app.use('/', require('./controllers/static'));

app.listen(3000, function () {
  console.log('Serwer nasłuchuje na porcie 3000');
});
