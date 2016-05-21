var Post = require('../../models/post'),
    router = require('express').Router();

router.get('/', function (req, res, next) {
  Post.find().sort('-date').exec(function (err, posts) {
    if (err) { return next(err); }
    res.json(posts);
  });
});

router.post('/', function (req, res, next) {
  var post = new Post({
    body: req.body.body
  });
  if (req.auth) {
    post.username = req.auth.username;
  }
  else {
    res.sendStatus(401);
  }
  post.save(function (err, post) {
    if (err) { return next(err); }
    res.status(201).json(post);
  });
});

module.exports = router;
