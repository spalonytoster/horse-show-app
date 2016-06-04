var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('html', function () {
  gulp.src('templates/**/*.html')
    .pipe(livereload());
});

gulp.task('watch:html', ['html'], function () {
  livereload.listen();
  gulp.watch('templates/**/*.html', ['html']);
});
