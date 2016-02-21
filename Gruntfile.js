module.exports = function(grunt) {

  grunt.initConfig({
    bower: {
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory 
        options: {
          targetDir: './public'
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [ {
          cwd: "app_client/jade/",
          src: "**/*.jade",
          dest: "app_client",
          expand: true,
          ext: ".view.html"
        } ]
      }
    },
    uglify: {
      angularAppJs: {
        files: {
          'public/angular/loc8rApp.js': [
            'app_client/app.js',
            'app_client/home/home.controller.js',
            'app_client/auth/register/register.controller.js',
            'app_client/auth/login/login.controller.js',
            'app_client/about/about.controller.js',
            'app_client/locationDetail/locationDetail.controller.js',
            'app_client/reviewModal/reviewModal.controller.js',
            'app_client/common/services/loc8rData.service.js',
            'app_client/common/services/authentication.service.js',
            'app_client/common/services/geolocation.service.js',
            'app_client/common/filters/formatDistance.filter.js',
            'app_client/common/filters/addHtmlLineBreaks.filter.js',
            'app_client/common/directives/ratingStars/ratingStars.directive.js',
            'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
            'app_client/common/directives/navigation/navigation.directive.js',
            'app_client/common/directives/navigation/navigation.controller.js',
            'app_client/common/directives/pageHeader/pageHeader.directive.js'
          ]
        }
      }
    },
    watch: {
      js: {
        files: [
          '**/*.js',
          '!public/angular/loc8rApp.js'
        ],
        tasks: ['uglify']
      },
      css: {
        files: [
          '**/*.jade',
          '**/*.js',
          '**/*.css'
        ],
        options: {
          livereload: true,
        },
      },
      jade: {
        files: [
          '**/*.jade'
        ],
        options: {
          livereload: true,
        },
        tasks: ['jade']
      },
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jade','uglify', 'watch']);

};