module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                files: {
                    'static/css/styles.css': ['static/styles/**/*.styl']
                }
            }
        },
        html2js: {
            options: {
                base: '.',
                rename: function (moduleName) {
                    return '/' + moduleName;
                }
            },
            main: {
                src: ['static/app/partials/**/*.html'],
                dest: 'static/js/templates.js'
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('build', ['stylus', 'html2js']);
};