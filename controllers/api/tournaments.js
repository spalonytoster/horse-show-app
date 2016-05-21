var router = require('express').Router(),
    moment = require('moment');
    // Tournament = require('../../models/tournament');

router.get('/', function (req, res, next) {
  // Tournament.find().sort('-date').exec(function (err, posts) {
  //   if (err) { return next(err); }
  //   res.json(posts);
  // });
  var tournaments = [
    {
      name: '#1 Grand Prix',
      location: 'Amsterdam',
      date: moment(),
      scoreTable: {
        value: "test1"
      },
      liveNow: true
    },
    {
      name: 'Mid-season Junior Open',
      location: 'London',
      date: moment().subtract(4, 'days'),
      scoreTable: {
        value: "test2"
      },
      liveNow: false
    },
    {
      name: 'Horses for charity!',
      location: 'Amsterdam',
      date: moment().subtract(10, 'days'),
      scoreTable: {
        value: "test3"
      },
      liveNow: false
    }
  ];
  res.json(tournaments);
});

router.post('/', function (req, res, next) {
  // var post = new Post({
  //   body: req.body.body
  // });
  // if (req.auth) {
  //   post.username = req.auth.username;
  // }
  // else {
  //   res.sendStatus(401);
  // }
  // post.save(function (err, post) {
  //   if (err) { return next(err); }
  //   res.status(201).json(post);
  // });
});

module.exports = router;
