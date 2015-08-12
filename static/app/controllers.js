'use strict';

define([ // jshint ignore:line
    'angular'
], function (angular) {
    var controllers = angular.module('LCSTutoringApp.controllers', []);

    controllers.controller('LCSTutoringApp.controllers.HomeController', [
        '$scope',
        function ($scope) {
            $scope.name = 'Home';
        }]);

    return controllers;
});