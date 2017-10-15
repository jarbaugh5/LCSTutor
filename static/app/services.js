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
        '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
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

            service.getAllTutees = function (cb, err) {
                $http.post('/getalltutees')
                    .success(function (data) {
                        console.log(data);
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.saveTutee = function (tutee, cb, err) {
                $http.post('/updatetutee',
                    $httpParamSerializer(tutee),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function () {
                        err();
                    });
            };

            service.deleteTutee = function (tutee, cb, err) {
                $http.post('/deletetutee',
                    $httpParamSerializer(tutee),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function (error) {
                        err(error);
                    });
            };


            return service;
        }
    ]);

    services.service('LCSTutoring.services.Tutor', [
        '$http',
        '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
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

            service.saveTutor = function (tutor, cb, err) {
                $http.post('/updatetutor',
                    $httpParamSerializer(tutor),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function () {
                        err();
                    });
            };

            service.getAllAdmins = function (cb, err) {
                $http.post('/getalladmins')
                    .success(function (data) {
                        console.log(data);
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.revokeAdmin = function (user, cb, err) {
                $http.post('/revokeadmin',
                    $httpParamSerializer(user),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function (error) {
                        err(error);
                    });
            };

            service.addAdmin = function (user, cb, err) {
                $http.post('/addadmin',
                    $httpParamSerializer(user),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function () {
                        err();
                    });
            };

            service.makeMatch = function (tutor, tutorEmail, tutee, tuteeEmail, cb, err) {
                $http.post('/makematch',
                $httpParamSerializer({
                    tutorId: tutor.id,
                    tutorEmail: tutorEmail,
                    tuteeId: tutee.id,
                    tuteeEmail: tuteeEmail
                }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (match) {
                        cb(match);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.deleteTutor = function (tutor, cb, err) {
                $http.post('/deletetutor',
                    $httpParamSerializer(tutor),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function () {
                        cb();
                    })
                    .error(function (error) {
                        err(error);
                    });
            };

            return service;
        }
    ]);

    services.service('LCSTutoring.services.Match', [
        '$http',
        '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
            var service = {};

            service.getAllMatches = function (cb, err) {
                $http.post('/getmatches',
                    {},
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.deleteMatch = function (matchId, cb, err) {
                $http.post('/deletematch',
                    $httpParamSerializer({
                        id: matchId
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            return service;
        }]);

    services.service('LCSTutoring.services.EmailTemplates', [
        '$http',
        '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
            var service = {};

            service.getAllEmailTemplates = function (cb, err) {
                $http.post('/getemailtemplates',
                    $httpParamSerializer({}),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.createEmailTemplate = function (name, body, cb, err) {
                $http.post('/createemailtemplate',
                    $httpParamSerializer({
                        name: name,
                        template: body
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.modifyEmailTemplate = function (template, cb, err) {
                $http.post('/modifyemailtemplate',
                    $httpParamSerializer({
                        id: template.id,
                        name: template.name,
                        template: template.template
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        err();
                    });
            };

            service.deleteEmailTemplate = function (template, cb, err) {
                $http.post('/deleteemailtemplate',
                    $httpParamSerializer({
                        id: template.id
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function (data) {
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