/*jslint node: true */
'use strict';

// Gulp main tools
// http://gulpjs.com
// https://www.npmjs.com/package/gulp
var gulp = require('gulp');
var watch = require('gulp-watch');

// CSS/JS/Image Tools
// https://www.npmjs.com/package/gulp-sass
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
// https://www.npmjs.com/package/gulp-concat
var concat = require('gulp-concat');
// https://www.npmjs.com/package/gulp-uglify
var uglify = require('gulp-uglify');
// https://www.npmjs.com/package/gulp-pixrem
var pixrem = require('gulp-pixrem');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var svgmin = require('gulp-svgmin');
// https://www.npmjs.com/package/gulp-jsonlint
// var jsonlint = require("gulp-jsonlint");
// var jshint = require('gulp-jshint');
// https://www.npmjs.com/package/run-sequence
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

// PHP QA Tools
// https://www.npmjs.com/package/gulp-shell
var gulpshell = require('gulp-shell');
// PHP Linters, Metrics and Coding Standards
// https://www.npmjs.com/package/gulp-phplint
var phplint = require('gulp-phplint');
// https://www.npmjs.com/package/gulp-phpcpd
var phpcpd = require('gulp-phpcpd');
// https://www.npmjs.com/package/gulp-phpmd
var phpmd = require('gulp-phpmd');
// https://www.npmjs.com/package/gulp-phpcs
var phpcs = require('gulp-phpcs');
// https://www.npmjs.com/package/gulp-phpcbf
var phpcbf = require('gulp-phpcbf');
// https://www.npmjs.com/package/gulp-phpunit
var phpunit = require('gulp-phpunit');

// paths
var sass_sync_src = 'webcontent/css/style.css';
var sass_watch_src = 'webcontent/sass/**/*.scss';
var sass_style_src = 'webcontent/sass/style.scss';
var sass_dest = 'webcontent/css/';

// Used to reload the page if something changes in these compiled files
var sass_reload_src = 'webcontent/css/style.css';

var scripts_reload_src = 'webcontent/js/min/scripts.min.js';

var scripts_dest = 'webcontent/js/min/';
var scripts_watch_src = [
  'webcontent/js/*.js',
  'webcontent/js/**/*.js',
  'webcontent/js/foundation/*.js',
  'webcontent/js/min/*.js'
];

// Sass styles task
// watches two .src glob locations and outputs to style.css
gulp.task('sass', function () {
  gulp.src(sass_style_src)
    .pipe(sass({
      errLogToConsole: true
      }))
    .pipe(pixrem({ replace: true }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(sass_dest));
});

gulp.task('minify-css', function() {
  return gulp.src(sass_reload_src)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest(sass_dest));
});

// JS concat task
gulp.task('scripts', function() {
  return gulp.src(scripts_watch_src)
    .pipe(concat('scripts.js'))
    // Add this back in to Minify JS
    // .pipe(uglify())
    .pipe(gulp.dest(scripts_dest));
});

// JS minify task
gulp.task('minify-scripts', function() {
  return gulp.src(scripts_watch_src)
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(scripts_dest));
});

// TODO!
// // add image minify task
// gulp.task('imagemin', function() {
//   return gulp.src(imgSrc)
//     .pipe(newer(imgSrc))
//     .pipe(imagemin())
//     .pipe(gulp.dest(imgDest));
// });
//
// // add svg minify task
// gulp.task('svgmin', function() {
//   return gulp.src(svgSrc)
//     .pipe(newer(svgSrc))
//     .pipe(svgmin())
//     .pipe(gulp.dest(svgDest));
// });

// Run tasks without watching.
gulp.task('build', function(callback) {
   // runSequence('sass', 'imagemin', 'svgmin', 'minify-css', callback);
   runSequence('sass', 'minify-css', 'scripts', 'minify-scripts', callback);
});

gulp.task('browser-sync', function() {
  browserSync.init([sass_reload_src, scripts_reload_src], {
    // If running on host (not in guest VM), enable proxy mode.
    proxy: '**site**', //TBD vm host configuration
    reloadDelay: 300, // default is 2000 (2 seconds)
    injectChanges: true, // Inject CSS changes
    // injectChanges: false, // Don't try to inject, just do a page refresh
  });
});

gulp.task('watch', function() {
  // gulp.watch(imgSrc, ['imagemin']);
  // gulp.watch(svgSrc, ['svgmin']);
  gulp.watch([sass_watch_src, sass_style_src], ['sass', 'minify-css']);
  gulp.watch(scripts_watch_src, ['scripts', 'minify-scripts']);
});

gulp.task('serve', function(callback) {
  runSequence('build', 'browser-sync', 'watch', callback);
});

// Default task
gulp.task('default', function () {
  runSequence('serve');
});

// TODO! Clean this up later
// // Custom PHP Code paths. We are not validating D7 core or contrib.
// var php_src_paths = [
//   'docroot/sites/all/modules/custom/**/*.php',
//   'docroot/sites/all/modules/custom/**/*.inc',
//   'docroot/sites/all/modules/custom/**/*.install',
//   'docroot/sites/all/modules/custom/**/*.module',
//   'docroot/sites/all/modules/features/**/*.php',
//   'docroot/sites/all/modules/features/**/*.inc',
//   'docroot/sites/all/modules/features/**/*.install',
//   'docroot/sites/all/modules/features/**/*.module',
//   '!vendor/**/*.*',
//   '!docroot/opcache.php',
//   '!docroot/memcached.php'
// ];
//
// gulp.task('phplint', function() {
//   return gulp.src(php_src_paths)
//     .pipe(phplint(''))
//     .pipe(phplint.reporter(function(file){
//       var report = file.phplintReport || {};
//       if (report.error) {
//         console.error(
//           report.message + ' on line ' + report.line + ' of ' + report.filename
//         );
//       }
//     }));
//     // .pipe(phplint.reporter('fail'));
// });
//
// // PHP Copy/Paste Detector
// gulp.task('phpcpd', function () {
//   return gulp.src(php_src_paths)
//     .pipe(phpcpd({
//       // bin: './vendor/bin/phpmd',
//     }));
// });
//
// // PHP Mess Detector
// gulp.task('phpmd', function () {
//   return gulp.src(php_src_paths)
//     // Validate code using PHP Mess Detector
//     .pipe(phpmd({
//       bin: './vendor/bin/phpmd',
//       format: 'text',
//       ruleset: 'codesize,unusedcode,naming,design,cleancode,controversial',
//     }))
//     .on('error', console.error);
// });
//
// // PHP_CodeSniffer
// //
// // Prerequisites:
// //   composer require drupal/coder (already done)
// //   composer install
// //
// //   global
// //
// //   phpcs --config-set installed_paths \
// //    ~/Sites/tacfs/vendor/drupal/coder/coder_sniffer
// //
// //    or project local
// //
// //    ./vendor/bin/phpcs --config-set installed_paths \
// //      ~/Sites/tacfs/vendor/drupal/coder/coder_sniffer
// //
// // Note: if you installed coder in a different location, update your
// // installed_paths
// // accordingly.
// gulp.task('phpcs', function () {
//   return gulp.src(php_src_paths)
//   // Validate files using PHP Code Sniffer
//   .pipe(phpcs({
//     bin: './vendor/bin/phpcs',
//     standard: 'Drupal',
//     warningSeverity: 0
//   }))
//   // Log all problems that was found
//   .pipe(phpcs.reporter('log'));
// });
//
// // PHP Code Beautifier
// // NOTE: Use with care as it cleans up and alters PHP code files
// // NOTE: Do not run automatically or blindly
// gulp.task('phpcbf', function () {
//   return gulp.src(php_src_paths)
//   .pipe(phpcbf({
//     bin: './vendor/bin/phpcbf',
//     standard: 'Drupal',
//     warningSeverity: 0
//   }))
//   .pipe(gulp.dest('docroot'));
// });
//
// // PHPUnit
// gulp.task('phpunit', function() {
//   var options = {debug: false};
//   gulp.src('phpunit.xml')
//     .pipe(phpunit('./vendor/bin/phpunit',options));
// });
//
// // WIP - enable gulp shell 9/9/2016:rshah9
// var pdependDocs = 'documentation/pdepend';
gulp.task('pdepend',
  gulpshell.task([
  //   'mkdir -p ' + pdependDocs,
  // 'vendor/bin/pdepend --summary-xml=' + pdependDocs +
  // '/summary.xml --jdepend-chart=' + pdependDocs +
  // '/chart.svg --overview-pyramid=' + pdependDocs +
  // '/pyramid.svg --ignore=vendor,node_modules --suffix=php,install,module,inc ' +
  // 'docroot/sites/all/modules/custom'
  ])
);
//
// // // PHP Watch Task - In case you want to just watch PHP work
// // gulp.task('phpqawatch', function () {
// //     gulp.watch([
// //       'composer.json',
// //       'phpunit.xml',
// //       // './**/*.php',
// //       '!vendor/**/*',
// //       '!node_modules/**/*'],
// //     function (event) {
// //         console.log(
// //           'File ' + event.path + ' was ' + event.type + ', running tasks...'
// //         );
// //     });
// //     gulp.watch('composer.json', ['dump-autoload']);
// //     gulp.watch([
// //       'phpunit.xml',
// //       // './**/*.php',
// //       '!vendor/**/*',
// //       '!node_modules/**/*'
// //       ],
// //       ['phplint', 'phpcs', 'phpunit']
// //     );
// // });
// // gulp.task('phpwatch', ['phplint', 'phpcs', 'phpunit', 'phpqawatch']);
//
