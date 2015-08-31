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

    services.service('LCSTutoring.services.PostService', [
        '$http',
        '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
            var postService = {};

            postService.tuteeSignupEndpoint = '/tuteesignup';
            postService.tutorSignupEndpoint = '/tutorsignup';

            postService.post = function (endpoint, data, cb, err) {
                $http.post(
                    endpoint,
                    $httpParamSerializer(data),//$.param(data),//encodeURIComponent(JSON.stringify(data)),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(cb)
                    .error(err);
            };

            return postService;
        }
    ]);

    services.service('LCSTutoring.services.Subjects', [
        '$http',
        function ($http) {
            var service = {};

            service.subjects = [];

            $http.post('/getsubjects')
                .success(function (data) {
                    Array.prototype.push.apply(service.subjects, data);
                })
                .error(function () {
                    console.error('Unable to get subjects list');
                });

            return service;
        }
    ]);

    services.service('LCSTutoring.services.Tutee', [
        '$http',
        function ($http) {
            var service = {};

            /* Expose data using two pointers so we don't have to $watch it later */
            service.tutee = {
                info: {}
            };

            $http.post('/gettuteeinfo')
                .success(function (data) {
                    console.log(data);
                    service.tutee.info = data;
                })
                .error(function () {
                    console.error('Unable to get tutee info');
                });

            return service;
        }
    ]);

    services.service('LCSTutoring.services.Tutor', [
        '$http',
        function ($http) {
            var service = {};

            /* Expose data using two pointers so we don't have to $watch it later */
            service.tutor = {
                info: {}
            };

            $http.post('/gettutorinfo')
                .success(function (data) {
                    console.log(data);
                    service.tutor.info = data;
                })
                .error(function () {
                    console.error('Unable to get tutee info');
                });

            service.getAllTutors = function (cb, err) {
                $http.post('/getalltutors')
                    .success(function (data) {
                        console.log(data);
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            return service;
        }
    ]);

    return services;
});