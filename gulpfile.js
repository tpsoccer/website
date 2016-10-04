'use strict';

// Gulp depencencies
const gulp = require('gulp');
const maps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const shell = require('gulp-shell');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');

// Express server
const os = require('os');
const interfaces = os.networkInterfaces();
const express = require('express');
const server = express();
const port = 3000;

// JavaScript asset pipeline
gulp.task('javascript', () => {
  return gulp.src([
    './js/src/**/*.js',
    '!./js/app.js',
    '!./js/app.min.js',
    '!./js/libraries/**/*.js',
    '!./js/maps/**/*.js'
  ])
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest('./js'))
  .pipe(maps.init())
  .pipe(uglify().on('error', gutil.log))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('./js'))
  .pipe(livereload());
});

// // Image asset pipeline
// gulp.task('image', () => {
//   return gulp.src('./src/img/src/*')
//   .pipe(imagemin([
//     imageminMozjpeg({
//       quality: 60
//     })
//   ]).on('error', gutil.log))
//   .pipe(gulp.dest('./src/img'));
// });

// Build Jekyll
gulp.task('build', () => {
  return gulp.src('', { read: false })
  .pipe(shell(['jekyll build']).on('error', gutil.log))
  .pipe(livereload());
});

// Express server
gulp.task('server', () => {
  let addresses = [];
  for (let i in interfaces) {
    for (let n in interfaces[i]) {
      let address = interfaces[i][n];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  server.use(express.static(__dirname + '/dist/'));
  server.listen(port, () => {
    for (let i = 0; i < addresses.length; i++) {
      gutil.log(`Server listening at ${gutil.colors.white(`${addresses[i]}:${port}`)}`);
    }
  });
  livereload.listen();
});

// Default "gulp" task for server, watching, livereload -- basically everything listed above
gulp.task('default', ['build', 'server'], () => {
  gulp.watch(['js/src/**/*'], ['javascript', 'build']);
  gulp.watch(['**/*', '!js/src/**/*', '!node_modules'], ['build']);
});
