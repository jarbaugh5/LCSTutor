'use strict';

define([ // jshint ignore:line
    'angular',
    'ngCookies',
    'services',
    'uiRouter',
], function (angular) {
    var controllers = angular.module('LCSTutoringApp.controllers', [
        'ngCookies',
        'LCSTutoring.services',
        'ui.router'
    ]);

    controllers.controller('LCSTutoringApp.controllers.LandingPageController', [
        '$scope',
        '$cookies',
        'LCSTutoring.services.UserInfo',
        '$state',
        function ($scope, $cookies, UserInfo, $state) {
            $scope.csrftoken = $cookies.get('csrftoken');

            if (UserInfo.hasInfo) {
                $state.go('home');
            }

            $scope.goToTuteeSignup = function () {
                $state.go('tuteeSignup');
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.HomeController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        '$state',
        '$window',
        function ($scope, UserInfo, $state, $window) {
            if (!UserInfo.hasInfo) {
                $state.go('landingPage');
            }

            $scope.logout = function () {
                $window.location.href = '/logout';
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.TuteeSignupController', [
        '$scope',
        '$state',
        function ($scope, $state) {
            $scope.goToHome = function () {
                $state.go('home');
            };
        }]);

    return controllers;
});