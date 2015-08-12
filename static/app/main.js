'use strict';

requirejs.config({ // jshint ignore:line
    baseUrl: '/static/app/',

    paths: {
        angular: '../vendor/angular/angular.min',
        uiRouter: '../vendor/angular-ui-router/release/angular-ui-router.min'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'uiRouter': {
            deps: ['angular']
        }
    },

    deps: ['app']
});