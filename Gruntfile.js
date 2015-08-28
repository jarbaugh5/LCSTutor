module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                files: {
                    'static/css/styles.css': ['static/styles/**/*.styl']
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('build', ['stylus']);
};