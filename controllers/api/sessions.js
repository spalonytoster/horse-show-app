var Person = require('../../models/person'),
    router = require('express').Router(),
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt'),
    config = require('../../config');

router.post('/', function (req, res, next) {
  var token;
  Person.findOne({ username: req.body.username })
  .select('username')
  .select('password')
  .exec(function (err, user) {
    if (err) { return next(err); }
    if (!user) { return res.sendStatus(401); }
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) { return next(err); }
      if (!valid) { return res.sendStatus(401); }
      token = jwt.encode({ username: req.body.username, role: user.role }, config.secret);
      res.send(token);
    });
  });
});

module.exports = router;
