'use strict';

requirejs.config({ // jshint ignore:line
    baseUrl: '/static/app/',

    paths: {
        angular: '../bower_components/angular/angular.min',
        uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router.min',
        ngCookies: '../bower_components/angular-cookies/angular-cookies.min',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
        jQuery: '../bower_components/jquery/dist/jquery.min'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'uiRouter': {
            deps: ['angular']
        },
        'ngCookies': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jQuery']
        }
    },

    deps: ['app']
});