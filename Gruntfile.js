module.exports = function(grunt) {

  grunt.initConfig({
    bower: {
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory 
        options: {
          targetDir: './public'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['bower']);

};