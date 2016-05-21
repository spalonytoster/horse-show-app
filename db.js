var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social', function () {
  console.log('Nazwiązano połączenie z mongodb.');
});

module.exports = mongoose;
