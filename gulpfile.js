//gulpfile.js

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    cssnano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnext = require('postcss-cssnext'),
    gulpLint = require("gulp-lint"),
    uncss = require('gulp-uncss'),
    sourcemaps = require('gulp-sourcemaps'),
    sassdoc = require('sassdoc'),
    deploy = require ('gulp-gh-pages');


//Copying tasks
// var paths = {
//   src: 'app/**/*',
//   srcHTML: 'app/**/*.html',
//   srcCSS: 'src/**/*.css',
//   srcJS: 'app/**/*.js',
//   dist: 'dist',
//   distIndex: 'dist/index.html',
//   distCSS: 'dist/**/*.css',
//   distJS: 'dist/**/*.js'
// };

gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

// Gulp watch syntax
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
    //Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});


//Sassdoc
gulp.task('sassdoc', function () {
  return gulp
    .src('app/scss')
    .pipe(sassdoc())
    .resume();
});

//Browser Sync - web server spin up
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})


//Concatenating
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
  // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});


//Styles Task
//SCSS to CSS compile
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')  // Gets all files ending with .scss in app/scss
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
    // .pipe(sourcemaps.write('app/css/maps'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))    
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


//POSTCSS and autoprefixer
gulp.task('css', function () {
  return gulp.src('app/*.css')
  .pipe(postcss([shortColor]))
  .pipe(gulp.dest('dist/css'));
});


//Copying Fonts to dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Copy files
gulp.task('copy', function () {
  return gulp.src(['app/index.html', 'app/js/script.js', 'app/*css/*', 'app/*fonts/*', 'app/*images/*'])
    .pipe(gulp.dest('dist/'));
});

//Image Task
//Image Optimizing
gulp.task('image', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'));
});


//cleaning dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
})


//clear cache off the local system
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})


//Push build to gh-pages
 gulp.task('deploy', function () {
  return gulp.src("dist/**/*")
    .pipe(deploy())
});


//Combining tasks
//1.
gulp.task('build', function (callback) {
  runSequence('cache:clear', ['sass', 'sassdoc', 'useref', 'image', 'fonts', 'copy'],
    callback
  )
})

//2.
gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})

  