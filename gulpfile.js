var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject');

gulp.task('injectjs', function() {
  var target = gulp.src('./index.html');
  var sources = gulp.src(['bower_components/angular/angular.js', 'bower_components/angular-ui-router/release/angular-ui-router.min.js', 'public/pizzeriaApp.js', 'public/*.js'], {read: false});
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('copy', function() {
    return gulp.src(['public/*'])
           .pipe(gulp.dest('build/'));
});

gulp.task('conandmin', function() {

    gulp.src('public/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest('build/'));

    gulp.src('public/style/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('build/'));

    return gulp.src('public/*.js')
             .pipe(concat('wow.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest('build/'));
});

gulp.task('build:prod', ['injectjs', 'copy']);
gulp.task('build:prod', ['injectjs', 'conandmin']);
