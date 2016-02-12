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
        files: {
          "app_client/**/*.html": "app_client/jade/**/*.jade"
        }
      }
    },
    watch: {
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
          '**/*.jade',
          '**/*.js',
          '**/*.css'
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

  grunt.registerTask('default', ['watch']);

};