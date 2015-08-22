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
            $scope.name = 'Home';

            $scope.csrftoken = $cookies.get('csrftoken');

            console.log(UserInfo);

            if (UserInfo.hasInfo) {
                $state.go('home');
            }
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

    return controllers;
});