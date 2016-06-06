var router = require('express').Router(),
  moment = require('moment'),
  Contest = require('../../models/contest'),
  _ = require('lodash');

router.get('/:nameFormatted', function(req, res, next) {
  Contest.findOne({
      nameFormatted: req.params.nameFormatted
    })
    .populate('groups.contestants.horse')
    .deepPopulate('groups.contestants.horse.breeder')
    .populate('groups.refrees')
    .exec(function(err, contest) {
      if (err) {
        return next(err);
      }
      res.json(contest);
    });
});

router.get('/', function(req, res, next) {
  Contest.find()
    .exec(function(err, contests) {
      if (err) {
        return next(err);
      }
      res.json(contests);
    });
});

router.post('/', function(req, res, next) {
  var groups = [];
  if (req.body.groups) {
    req.body.groups.forEach(function(group) {
      var groupToRet = {};
      groupToRet.name = group.name;
      groupToRet.contestants = [];
      groupToRet.refrees = [];
      group.contestants.forEach(function(contestant) {
        var contestantToRet = {};
        contestantToRet.horse = contestant.horse;
        contestantToRet.number = contestant.number;
        contestantToRet.score = contestant.score;
        groupToRet.contestants.push(contestantToRet);
      });
      group.refrees.forEach(function(refree) {
        groupToRet.refrees.push(refree);
      });
      groups.push(groupToRet);
    });
  }

  var contest = new Contest({
    name: req.body.name,
    nameFormatted: _.kebabCase(req.body.name + ' ' + req.body.location.city),
    date: req.body.date,
    location: {
      city: req.body.location.city,
      country: req.body.location.country
    },
    format: {
      min: req.body.format.min,
      max: req.body.format.max,
      halvesAllowed: req.body.format.halvesAllowed
    },
    groups: groups,
  });

  console.dir(contest);

  contest.save(function(err, contest) {
    if (err) {
      console.dir(err);
      return next(err);
    }
    res.status(201).json(contest);
  });
});

router.patch('/', function(req, res, next) {
  console.dir(req.body);
  var contest = new Contest(req.body);
  contest.save(function(err, contest) {
    if (err) {
      console.dir(err);
      return next(err);
    }
    res.status(201).json(contest);
  });
});

module.exports = router;
