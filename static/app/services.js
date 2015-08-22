'use strict';

define([ // jshint ignore:line
    'angular'
], function (angular) {
    var services = angular.module('LCSTutoring.services', []);

    /**
     * A service that contains the user information
     *
     * Fields:
     *  * hasInfo (bool)
     *  * user (Obj)
     *
     * user fields:
     *  * username
     *  * email
     *  * first_name
     *  * last_name
     *
     * false if the user is anonymous aka not authenticated
     */
    services.service('LCSTutoring.services.UserInfo', ['$window', function ($window) {
        var user = $window.lcs_user; // jshint ignore:line

        return {
            hasInfo: user !== null,
            user: user
        };
    }]);

    return services;
});