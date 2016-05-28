var mongoose = require('mongoose'),
    dbName = require('./config').dbName;

mongoose.connect('mongodb://localhost/' + dbName, function () {
  console.log('Nazwiązano połączenie z mongodb.');
});

module.exports = mongoose;
