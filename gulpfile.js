(() => {
  'use strict';
  const gulp = require('gulp');
  const babel = require('gulp-babel');
  const concat = require('gulp-concat');
  const minifyCss = require('gulp-minify-css');
  const rename = require('gulp-rename');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');
  const browserify = require('gulp-browserify');

  const paths = {
    external_scripts: [
      'app/static/vendor/jquery/dist/jquery.min.js',
      'app/static/vendor/bootstrap/dist/js/bootstrap.min.js',
      'app/static/vendor/moment/min/moment-with-locales.min.js',
      'app/static/vendor/arrive/minified/arrive.min.js',
      'app/static/vendor/bootstrap-material-design/dist/js/material.min.js',
      'app/static/vendor/bootstrap-material-design/dist/js/ripples.min.js',
      'app/static/vendor/sweetalert/dist/sweetalert.min.js',
      'app/static/vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'app/static/vendor/parsleyjs/dist/parsley.min.js',
      'app/static/vendor/accounting/accounting.min.js',
      'app/static/vendor/selectize/dist/js/standalone/selectize.min.js',
      'app/static/vendor/bootstrap-table/dist/bootstrap-table.min.js',
      'app/static/vendor/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js',
      'app/static/vendor/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js',
      'app/static/vendor/PACE/pace.min.js',
      'app/static/vendor/react/react.min.js',
      'app/static/vendor/react/react-dom.min.js',
      'app/static/vendor/flux/dist/Flux.min.js',
      'app/static/vendor/lodash/lodash.min.js',
      'app/static/vendor/react-bootstrap/react-bootstrap.min.js'
      //'app/static/vendor/eventemitter2/lib/eventemitter2.js'
    ],
    scripts: [
      'app/static/js/index.js',
      'app/static/js/main.js',
      'app/static/js/progress.js',
      'app/static/js/project_base.js',
      'app/static/js/variation.js'
    ],
    react_scripts: [
      'app/static/js/new-project-form.jsx',
      'app/static/js/new-variation-form.jsx',
      'app/static/js/new-progress-items-form.jsx',
      'app/static/js/index-projects.jsx',
      'app/static/js/index-menu.jsx',
      'app/static/js/edit-project-meta-form.jsx',
      'app/static/js/project-info.jsx'
    ],
    js_output: 'app/static/dist/js',
    css_output: 'app/static/dist/css',
    vendor_css: [
      'app/static/vendor/bootstrap/dist/css/bootstrap.min.css',
      'app/static/vendor/font-awesome/css/font-awesome.min.css',
      'app/static/vendor/bootstrap-material-design/dist/css/material.min.css',
      'app/static/vendor/bootstrap-material-design/dist/css/ripples.min.css',
      'app/static/vendor/bootstrap-material-design/dist/css/roboto.min.css',
      'app/static/vendor/sweetalert/dist/sweetalert.css',
      'app/static/vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
      'app/static/vendor/selectize/dist/css/selectize.bootstrap3.css',
      'app/static/vendor/bootstrap-table/dist/bootstrap-table.min.css',
      'app/static/vendor/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css'
    ],
    css: [
      'app/static/css/main.css'
    ]
  };

  gulp.task('vendor', () =>
      gulp.src(paths.external_scripts)
          .pipe(concat('packed.js'))
          .pipe(gulp.dest(paths.js_output))
  );

  gulp.task('script', () =>
      gulp.src(paths.scripts)
          .pipe(sourcemaps.init())
          .pipe(babel({stage: 0}))
          .pipe(uglify({
            compress: {
              unused: false
            }
          }))
          .pipe(rename({
            extname: '.min.js'
          }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(paths.js_output))
  );

  gulp.task('react', () =>
      gulp.src(paths.react_scripts)
          .pipe(sourcemaps.init())
          .pipe(babel({stage: 0}))
          .pipe(browserify())
          .pipe(uglify())
          .pipe(rename({
            extname: '.min.js'
          }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(paths.js_output))
  );

  gulp.task('watch', () => {
    gulp.watch(paths.external_scripts, ['vendor']);
    gulp.watch(paths.scripts, ['script']);
    gulp.watch(paths.react_scripts, ['react']);
  });

  gulp.task('minify-vendor-css', () =>
      gulp.src(paths.vendor_css)
          .pipe(minifyCss())
          .pipe(concat('packed.css'))
          .pipe(gulp.dest(paths.css_output))
  );

  gulp.task('minify-css', () =>
      gulp.src(paths.css)
          .pipe(sourcemaps.init())
          .pipe(minifyCss())
          .pipe(rename({
            extname: '.min.css'
          }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(paths.css_output))
  );

  gulp.task('copy-fonts1', () =>
      gulp.src('app/static/vendor/bootstrap/fonts/**')
          .pipe(gulp.dest('app/static/dist/fonts'))
  );
  gulp.task('copy-fonts2', () =>
      gulp.src('app/static/vendor/font-awesome/fonts/**')
          .pipe(gulp.dest('app/static/dist/fonts'))
  );
  gulp.task('copy-fonts3', () =>
      gulp.src('app/static/vendor/bootstrap-material-design/fonts/**')
          .pipe(gulp.dest('app/static/dist/fonts'))
  );
  gulp.task('copy-imgs', () =>
      gulp.src('app/static/vendor/x-editable/dist/bootstrap3-editable/img/**')
          .pipe(gulp.dest('app/static/dist/img'))
  );

  gulp.task('default', ['watch', 'vendor', 'react', 'script', 'minify-vendor-css', 'minify-css', 'copy-fonts1', 'copy-fonts2', 'copy-fonts3', 'copy-imgs']);
  gulp.task('build', ['vendor', 'react', 'script', 'minify-vendor-css', 'minify-css', 'copy-fonts1', 'copy-fonts2', 'copy-fonts3', 'copy-imgs']);
})();
