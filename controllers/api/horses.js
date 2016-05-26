var router = require('express').Router(),
    moment = require('moment'),
    Horse = require('../../models/horse').model;

router.get('/', function (req, res, next) {
  Horse.find(function (err, horses) {
    if (err) { return next(err); }
    res.json(horses);
  });
});

router.post('/', function (req, res, next) {
  var breeder = Person.findOne({_id: req.body.breeder}, function (err, breeder) {
    if (err) { return next(err); }
    return breeder;
  });

  var horse = new Horse({
    name: req.body.name,
    sex: req.body.sex,
    breeder: req.body.breeder
  });

  horse.save(function (err, horse) {
    if (err) { return next(err); }
    res.status(201).json(horse);
  });
});

module.exports = router;
