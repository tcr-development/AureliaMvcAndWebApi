// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

var config = {
  //Include all js files but exclude any min.js files
   src: ['app/**/*.js', '!app/**/*.min.js'],
   html: ['app/**/*.html']
}

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('scripts', function () {

  return gulp.src(config.src)
    .pipe(uglify())
 //   .pipe(concat('all.min.js'))  ///would cobine all files and then copy
    .pipe(gulp.dest('appmin/'));

});

gulp.task('html', function() {
   //copy all html files from source folder to destination under appmin
  return gulp.src(config.html)
    .pipe(gulp.dest('appmin/'));

});

//Set a default tasks
gulp.task('default', ['scripts', 'html'], function () { });