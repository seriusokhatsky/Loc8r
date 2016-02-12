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

  grunt.registerTask('default', ['watch']);

};