'use strict';
// Gulp stuff
const gulp = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pump = require('pump');
const livereload = require('gulp-livereload');
const shell = require('gulp-shell');
const gutil = require('gulp-util');

// Express server
const express = require('express');
const server = express();
const port = 3000;

// Flag toggles server "on" after initial Gulp default
let serverInit = false;

// Concat all JS to 'src/js/main.js'
// If any libraries are used, they will need to be handled separately
gulp.task('concat-js', () => {
  return gulp.src(['./src/js/**/*.js', '!./src/js/main.js', '!./src/js/main.min.js'])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./src/js'))
  .pipe(livereload());
});

// Minify all JS to 'src/js/main.min.js'
// If any libraries are used, they will need to be handled separately
gulp.task('minify-js', (cb) => {
  pump([
    gulp.src('./src/js/main.js')
    .pipe(rename({suffix: '.min'})),
    uglify(),
    gulp.dest('./src/js')
    .pipe(livereload())
    ],
  cb);
});

// Build Jekyll
gulp.task('build', () => {
  return gulp.src('', { read: false })
  .pipe(shell(['cd src && jekyll build']))
  .pipe(livereload());
});

// Default "gulp" task for Express server, watching, livereload
// -- basically everything listed above
gulp.task('default', ['build'], () => {
  if (!serverInit) {
    server.use(express.static(__dirname + '/dist/'));
    server.listen(port, () => gutil.log(`Server listening on port ${port}... `));
    serverInit = true;
  }
  livereload.listen();
  gulp.watch('./src/js/**/*.js', ['concat-js']);
  gulp.watch('./src/js/**/*.js', ['minify-js']);
  gulp.watch(['./src/**/**', '!./src/js/**/*.js'], ['build']);
});
