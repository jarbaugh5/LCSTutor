'use strict';

requirejs.config({ // jshint ignore:line
    baseUrl: '/static/app/',

    paths: {
        angular: '../vendor/angular/angular.min',
        uiRouter: '../vendor/angular-ui-router/release/angular-ui-router.min',
        ngCookies: '../vendor/angular-cookies/angular-cookies.min',
        bootstrap: '../vendor/bootstrap/js/bootstrap.min',
        jQuery: '../vendor/jquery/jquery.min'
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