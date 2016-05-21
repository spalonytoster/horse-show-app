var User = require('../../models/user'),
    router = require('express').Router(),
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt'),
    config = require('../../config');

router.post('/', function (req, res, next) {
  var token;
  User.findOne({ username: req.body.username })
  .select('password')
  .exec(function (err, user) {
    if (err) { return next(err); }
    if (!user) { return res.sendStatus(401); }
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) { return next(err); }
      if (!valid) { return res.sendStatus(401); }
      token = jwt.encode({ username: req.body.username }, config.secret);
      res.send(token);
    });
  });
});

module.exports = router;
