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
// app.use('/api/posts', require('./controllers/api/posts'));
// app.use('/api/sessions', require('./controllers/api/sessions'));
// app.use('/api/users', require('./controllers/api/users'));
app.use('/', require('./controllers/static'));

app.listen(3000, function () {
  console.log('Serwer nasłuchuje na porcie 3000');
});
