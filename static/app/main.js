'use strict';

requirejs.config({ // jshint ignore:line
    baseUrl: '/static/app/',

    paths: {
        angular: window.lcsFilepaths.angular.slice(0, -3), // remove .js from the end
        uiRouter: window.lcsFilepaths.uiRouter.slice(0, -3),
        ngCookies: window.lcsFilepaths.ngCookies.slice(0, -3),
        bootstrap: window.lcsFilepaths.bootstrap.slice(0, -3),
        jQuery: window.lcsFilepaths.jQuery.slice(0, -3),

        // Modules
        app: window.lcsFilepaths.app.slice(0, -3),
        services: window.lcsFilepaths.services.slice(0, -3),
        controllers: window.lcsFilepaths.controllers.slice(0, -3),
        templates: window.lcsFilepaths.templates.slice(0, -3)
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
        },
        'templates': {
            deps: ['angular']
        }
    },

    deps: ['app']
});