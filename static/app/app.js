'use strict';

define([ // jshint ignore:line
    'angular',
    'uiRouter',
    'controllers'
], function (angular) {
    var app = angular.module('LCSTutoringApp', ['ui.router', 'LCSTutoringApp.controllers']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'LCSTutoringApp.controllers.HomeController',
                templateUrl: '/static/app/partials/home.html'
            });

        $locationProvider.html5Mode(true);
    });

    // Manually bootstrap the app since the JS is asynchronously loaded
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['LCSTutoringApp']);
    });

    return app;
});