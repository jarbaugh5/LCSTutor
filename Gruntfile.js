module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Would rather just copy minified dependencies before
        // deployment than mess with multi-builpacks again
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['bower_components/angular/angular.min.js'], dest: 'static/lib/angular/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy']);
};