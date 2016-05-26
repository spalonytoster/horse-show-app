var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/horse-show', function () {
  console.log('Nazwiązano połączenie z mongodb.');
});

module.exports = mongoose;
