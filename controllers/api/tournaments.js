var router = require('express').Router();
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
      date: new Date(),
      scoreTable: {
        value: "test1"
      }
    },
    {
      name: 'Mid-season Junior Open',
      location: 'London',
      date: new Date(),
      scoreTable: {
        value: "test2"
      }
    },
    {
      name: 'Horses for charity!',
      location: 'Amsterdam',
      date: new Date(),
      scoreTable: {
        value: "test3"
      }
    }
  ];
  res.jsonp(tournaments);
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
