module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Would rather just copy minified dependencies before
        // deployment than mess with multi-builpacks again
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['bower_components/angular/angular.min.js'], dest: 'static/vendor/angular/'},
                    {expand: true, flatten: true, src: ['bower_components/angular-ui-router/release/angular-ui-router.min.js'], dest: 'static/vendor/angular-ui-router/release/'},
                    {expand: true, flatten: true, src: ['bower_components/angular-cookies/angular-cookies.min.js'], dest: 'static/vendor/angular-cookies'},

                    {expand: true, flatten: true, src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'static/vendor/bootstrap/css'},
                    {expand: true, flatten: true, src: ['bower_components/bootstrap/dist/js/bootstrap.min.js'], dest: 'static/vendor/bootstrap/js'},


                    {expand: true, flatten: true, src: ['bower_components/jquery/dist/jquery.min.js'], dest: 'static/vendor/jquery'}
                ]
            }
        },
        stylus: {
            compile: {
                files: {
                    'static/css/styles.css': ['static/styles/**/*.styl']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('default', ['copy', 'stylus']);
};