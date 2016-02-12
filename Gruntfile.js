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
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};