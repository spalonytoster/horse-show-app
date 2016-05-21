var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    livereload = require('gulp-livereload');

gulp.task('js', function () {
  gulp.src(['ng/mainModule.js', 'ng/config.js', 'ng/routes.js', 'ng/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/js'))
    .pipe(livereload());
});

gulp.task('watch:js', ['js'], function () {
  livereload.listen();
  gulp.watch('ng/**/*.js', ['js']);
});
