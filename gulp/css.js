var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload');

gulp.task('styl', function () {
  gulp.src('stylesheets/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload());
});

gulp.task('css', function () {
  gulp.src('stylesheets/**/*.css')
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload());
});

gulp.task('watch:css', ['styl'], function () {
  livereload.listen();
  gulp.watch('stylesheets/**/*.styl', ['styl']);
  gulp.watch('stylesheets/**/*.css', ['css']);
});
