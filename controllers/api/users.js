var User = require('../../models/user'),
    router = require('express').Router(),
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt'),
    config = require('../../config');


router.get('/', function (req, res) {
  var token, auth;
  token = req.headers['x-auth'];
  auth = jwt.decode(token, config.secret);
  User.findOne({ username: auth.username }, function (err, user) {
    res.json(user);
  });
});

router.post('/', function (req, res, next) {
  var user;
  user = new User({ username: req.body.username });
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    user.password = hash;
    user.save(function (err) {
      if (err) { throw next(err); }
      res.sendStatus(201);
    });
  });
});

module.exports = router;
