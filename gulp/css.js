var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload');

gulp.task('css', function () {
  gulp.src('stylesheets/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload());
});

gulp.task('watch:css', ['css'], function () {
  livereload.listen();
  gulp.watch('stylesheets/**/*.styl', ['css']);
});
