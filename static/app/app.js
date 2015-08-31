'use strict';

define([ // jshint ignore:line
    'angular',
    'uiRouter',
    'controllers',
    'jQuery',
    'bootstrap',
    'templates',
], function (angular) {
    var app = angular.module('LCSTutoringApp', ['ui.router', 'LCSTutoringApp.controllers', 'templates-main']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('landingPage', {
                url: '/',
                controller: 'LCSTutoringApp.controllers.LandingPageController',
                templateUrl: '/static/app/partials/landing-page.html'
            })
            .state('home', {
                url: '/home',
                controller: 'LCSTutoringApp.controllers.HomeController',
                templateUrl: '/static/app/partials/home.html'
            })
            .state('tuteeSignup', {
                url: '/tuteesignup',
                controller: 'LCSTutoringApp.controllers.TuteeSignupController',
                templateUrl: '/static/app/partials/tutee-signup.html'
            })
            .state('tutorSignup', {
                url: '/tutorsignup',
                controller: 'LCSTutoringApp.controllers.TutorSignupController',
                templateUrl: '/static/app/partials/tutor-signup.html'
            })
            .state('infoView', {
                url: '/viewinfo',
                controller: 'LCSTutoringApp.controllers.InfoViewController',
                templateUrl: '/static/app/partials/info-view.html'
            })
            .state('postSignup', {
                url: '/thankyou',
                controller: 'LCSTutoringApp.controllers.PostSignupController',
                templateUrl: '/static/app/partials/post-signup.html'
            })
            .state('editTutors', {
                url: '/edittutors',
                controller: 'LCSTutoringApp.controllers.EditTutorsController',
                templateUrl: '/static/app/partials/edit-tutors.html'
            }).state('editTutees', {
                url: '/edittutees',
                controller: 'LCSTutoringApp.controllers.EditTuteesController',
                templateUrl: '/static/app/partials/edit-tutees.html'
            });

        $locationProvider.html5Mode(true);

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    });

    // Manually bootstrap the app since the JS is asynchronously loaded
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['LCSTutoringApp']);
    });

    return app;
});