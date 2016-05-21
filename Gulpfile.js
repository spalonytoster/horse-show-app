var gulp = require('gulp'),
    fs = require('fs');

fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require('./gulp/' + task);
});

gulp.task('dev', ['watch:css', 'watch:js', 'dev:server']);
