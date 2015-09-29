module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        mangle: false
      },
      vendor: {
        files: {
          'app/static/js/packed.js': [
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
            'app/static/vendor/PACE/pace.min.js'
          ]
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'app/static/css/packed.css': [
            'app/static/vendor/bootstrap/dist/css/bootstrap.min.css',
            'app/static/vendor/font-awesome/css/font-awesome.min.css',
            'app/static/vendor/bootstrap-material-design/dist/css/material.min.css',
            'app/static/vendor/bootstrap-material-design/dist/css/ripples.min.css',
            'app/static/vendor/bootstrap-material-design/dist/css/roboto.min.css',
            'app/static/vendor/sweetalert/dist/sweetalert.css',
            'app/static/vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
            'app/static/vendor/selectize/dist/css/selectize.bootstrap3.css',
            'app/static/vendor/bootstrap-table/dist/bootstrap-table.min.css',
            'app/static/vendor/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css',
          ]
        }
      }
    },

    copy: {
      first: {
        src: 'app/static/vendor/bootstrap-material-design/fonts/*',
        dest: 'app/static/fonts/'
      },
      second: {
        src: 'app/static/vendor/font-awesome/fonts/*',
        dest: 'app/static/fonts/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['uglify', 'cssmin', 'copy']);
};
