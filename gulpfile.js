var gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    lazypipe = require('lazypipe'),
    taskListing = require('gulp-task-listing');


gulp.task('help', taskListing);

gulp.task('default', taskListing);

gulp.task('start', function (callback) {
  runSequence(
    ['sass', 'browserSync', 'watch'],
    callback
  )
});

gulp.task('sass', function () {
  return gulp.src(['app/**/*.scss', '!app/bower_components/**'])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

gulp.task('useref', function () {
  return gulp.src(['app/**/*.html','!app/bower_components/**'])
    //.pipe(useref())
    .pipe(useref({}, lazypipe()
      .pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
      .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    ['sass', 'useref'],
    callback
  )
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch(['app/**/*.scss', '!app/bower_components'], ['sass']);
  gulp.watch(['app/**/*.html', '!app/bower_components'], browserSync.reload);
  gulp.watch(['app/**/*.js', '!app/bower_components'], browserSync.reload);
});