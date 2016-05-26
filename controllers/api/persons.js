var router = require('express').Router(),
    moment = require('moment'),
    Person = require('../../models/person').model,
    roles = require('../../config').roles;

router.get('/breeders', function (req, res, next) {
  Person.find({ role: roles.BREEDER }).sort('-date').exec(function (err, breeders) {
    if (err) { return next(err); }
    res.json(breeders);
  });
});

router.post('/', function (req, res, next) {
  var person = new Person({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    name: req.body.name,
    surname: req.body.surname
  });

  person.save(function (err, person) {
    if (err) { return next(err); }
    res.status(201).json(person);
  });
});

module.exports = router;
