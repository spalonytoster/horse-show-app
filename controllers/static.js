var router = require('express').Router(),
    appRoot = require('app-root-path');

router.get('*', function (req, res) {
  res.sendFile('app.html', { root: appRoot + '/templates/' });
});

module.exports = router;
