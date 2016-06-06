/* jshint node: true */
'use strict';

var router = require('express').Router(),
    moment = require('moment'),
    Person = require('../../models/person'),
    roles = require('../../config').roles,
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt'),
    config = require('../../config');

  router.get('/user', function (req, res, next) {
    if (!req.headers['x-auth']) {
      res.status(401).end();
    }
    var token, auth;
    token = req.headers['x-auth'];

    if (!token) {
      res.status(401).end();
    }

    auth = jwt.decode(token, config.secret);

    Person.findOne({ username: auth.username })
    .select('username')
    .select('role')
    .select('name')
    .select('surname')
    .exec(function (err, user) {
      if (err) { return next(err); }
      res.json(user);
    });
  });

router.get('/refrees', function (req, res, next) {
  Person.find({ role: roles.REFREE }).sort('-date').exec(function (err, refrees) {
    if (err) { return next(err); }
    res.json(refrees);
  });
});

router.get('/breeders', function (req, res, next) {
  Person.find({ role: roles.BREEDER }).sort('-date').exec(function (err, breeders) {
    if (err) { return next(err); }
    res.json(breeders);
  });
});

router.get('/:username', function (req, res, next) {
  Person.findOne({ username: req.params.username })
  .select('username')
  .select('password')
  .select('role')
  .select('name')
  .select('surname')
  .exec(function (err, person) {
    if (err) { return next(err); }
    res.json(person);
  });
});

router.get('/:id', function (req, res, next) {
  Person.findOne({ _id: req.params.id }, function (err, person) {
    if (err) { return next(err); }
    res.json(person);
  });
});

router.post('/', function (req, res, next) {
  var person = new Person({
    username: req.body.username,
    role: req.body.role,
    name: req.body.name,
    surname: req.body.surname
  });

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    person.password = hash;
    person.save(function (err) {
      if (err) { throw next(err); }
      res.sendStatus(201);
    });
  });

});

module.exports = router;
