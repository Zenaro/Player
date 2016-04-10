/**
 * Created by Administrator on 2016/3/29.
 */
// 引入gulp
var gulp = require("gulp");

// 引入组件
var less = require('gulp-less'),
    livereload = require('gulp-livereload'),        //自动刷新页面
    minifycss = require('gulp-minify-css'),		//css压缩
    concat = require('gulp-concat'),		//文件合并
    rename = require('gulp-rename'),		//文件更名
    uglify = require('gulp-uglify');

// style
gulp.task('style', function() {
    return gulp.src('src/less/*.less')
        .pipe(less())
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dest/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dest/css'));
});

// js
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dest/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dest/js'));
});

// Default task
gulp.task('default', function() {
    gulp.start('style', 'js');
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/less/*.less', ['style']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('dest/**/*.*',function(file){
        livereload.changed(file.path);
    });

});