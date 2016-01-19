var gulp        = require('gulp'),
    handlebars  = require('gulp-compile-handlebars'),
    path        = require('path'),
    moment      = require('moment'),
    fs          = require('fs'),
    sass        = require('gulp-sass'),
    rimraf      = require('rimraf');

var paths = {
    src  : 'templates',
    styles : 'templates/styles'
}

gulp.task('styles', function() {
    gulp.src(path.join(paths.styles, '/*.scss'), { base: paths.src })
        .pipe(sass())
        .pipe(gulp.dest(paths.src));
});
