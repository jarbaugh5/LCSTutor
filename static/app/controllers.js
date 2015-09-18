'use strict';

define([ // jshint ignore:line
    'angular',
    'ngCookies',
    'services',
    'uiRouter',
    'uiBootstrap',
], function (angular) {
    var controllers = angular.module('LCSTutoringApp.controllers', [
        'ngCookies',
        'LCSTutoring.services',
        'ui.router',
        'ui.bootstrap'
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

            $scope.goToTutorSignup = function () {
                $state.go('tutorSignup');
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

            $state.go('infoView');

            $scope.logout = function () {
                $window.location.href = '/logout';
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.TuteeSignupController', [
        '$scope',
        '$state',
        'LCSTutoring.services.PostService',
        'LCSTutoring.services.Subjects',
        function ($scope, $state, PostService, Subjects) {
            $scope.formData = {};

            $scope.formData.firstName = '';
            $scope.formData.lastName = '';
            $scope.formData.username = '';
            $scope.formData.password = '';
            $scope.formData.confirmPassword = '';
            $scope.formData.email = '';
            $scope.formData.satHelp = false;
            $scope.formData.subjects = [];
            $scope.formData.gender = 'male'; // Choosing one by default
            $scope.formData.other = false; // Other gender flag
            $scope.formData.otherGender = ''; // Other gender text if flag is true
            $scope.formData.grade = '1'; // Choosing one by default
            $scope.formData.parentName = '';
            $scope.formData.parentPhone = '';
            $scope.formData.extraInfo = '';

            $scope.subjectChoices = Subjects.subjects;


            $scope.goToHome = function () {
                $state.go('home');
            };

            $scope.toggleSubjectSelection = function (subject) {
                var found = false;
                var removeIndex;

                for (var i = 0; !found && i < $scope.formData.subjects.length; i++) {
                    var currSubjectId = $scope.formData.subjects[i];
                    if (currSubjectId === subject.id) {
                        found = true;
                        removeIndex = i;
                    }
                }

                if (found) {
                    $scope.formData.subjects.splice(removeIndex, 1);
                } else {
                    $scope.formData.subjects.push(subject.id);
                }
            };

            $scope.submitForm = function () {
                PostService.post(
                    PostService.tuteeSignupEndpoint,
                    {
                        'first_name': $scope.formData.firstName,
                        'last_name': $scope.formData.lastName,
                        'username': $scope.formData.username,
                        'password': $scope.formData.password,
                        'confirm_password': $scope.formData.confirmPassword,
                        'email': $scope.formData.email,
                        'sat_help': $scope.formData.satHelp,
                        'subjects': $scope.formData.subjects,
                        'gender': $scope.formData.other ? $scope.formData.otherGender : $scope.formData.gender,
                        'grade': $scope.formData.grade,
                        'parent_name': $scope.formData.parentName,
                        'parent_phone': $scope.formData.parentPhone,
                        'extra_info': $scope.formData.extraInfo
                    },
                    function () {
                        console.log('Posted tutee signup data');
                        $state.go('postSignup');
                    },
                    function (errors) {
                        console.error('Error posting tutee signup data');

                        $scope.errors = [];

                        var keys = Object.keys(errors);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            if (!errors[key]) continue;

                            $scope.errors.push({
                                'field': key,
                                'message': errors[key][0].message
                            });
                        }
                    }
                );
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.TutorSignupController', [
        '$scope',
        '$state',
        'LCSTutoring.services.PostService',
        'LCSTutoring.services.Subjects',
        function ($scope, $state, PostService, Subjects) {
            $scope.formData = {};

            $scope.formData.firstName = '';
            $scope.formData.lastName = '';
            $scope.formData.username = '';
            $scope.formData.password = '';
            $scope.formData.confirmPassword = '';
            $scope.formData.email = '';
            $scope.formData.phone = '';
            $scope.formData.satHelp = false;
            $scope.formData.subjects = [];
            $scope.formData.gender = 'male'; // Choosing one by default
            $scope.formData.other = false; // Other gender flag
            $scope.formData.otherGender = ''; // Other gender text if flag is true
            //$scope.formData.grade = '1'; // Choosing one by default
            $scope.formData.extraInfo = '';

            $scope.subjectChoices = Subjects.subjects;


            $scope.goToHome = function () {
                $state.go('home');
            };

            $scope.toggleSubjectSelection = function (subject) {
                var found = false;
                var removeIndex;

                for (var i = 0; !found && i < $scope.formData.subjects.length; i++) {
                    var currSubjectId = $scope.formData.subjects[i];
                    if (currSubjectId === subject.id) {
                        found = true;
                        removeIndex = i;
                    }
                }

                if (found) {
                    $scope.formData.subjects.splice(removeIndex, 1);
                } else {
                    $scope.formData.subjects.push(subject.id);
                }
            };

            $scope.submitForm = function () {
                PostService.post(
                    PostService.tutorSignupEndpoint,
                    {
                        'first_name': $scope.formData.firstName,
                        'last_name': $scope.formData.lastName,
                        'username': $scope.formData.username,
                        'password': $scope.formData.password,
                        'confirm_password': $scope.formData.confirmPassword,
                        'email': $scope.formData.email,
                        'phone': $scope.formData.phone,
                        'sat_help': $scope.formData.satHelp,
                        'subjects': $scope.formData.subjects,
                        'gender': $scope.formData.other ? $scope.formData.otherGender : $scope.formData.gender,
                        //'grade': $scope.formData.grade,
                        'extra_info': $scope.formData.extraInfo
                    },
                    function () {
                        console.log('Posted tutor signup data');
                        $state.go('postSignup');
                    },
                    function (errors) {
                        console.error('Error posting tutee signup data');

                        $scope.errors = [];

                        var keys = Object.keys(errors);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            if (!errors[key]) continue;

                            $scope.errors.push({
                                'field': key,
                                'message': errors[key][0].message
                            });
                        }
                    }
                );
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.PostSignupController', [
        '$scope',
        '$state',
        function ($scope, $state) {
            $scope.goToHome = function () {
                $state.go('home');
            };

            $scope.goToInfo = function () {
                $state.go('landingPage');
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.InfoViewController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutee',
        'LCSTutoring.services.Tutor',
        '$state',
        '$window',
        function ($scope, UserInfo, Tutee, Tutor, $state, $window) {
            if (!UserInfo.hasInfo) {
                $state.go('landingPage');
            }

            $scope.is_staff = UserInfo.user.is_staff;

            $scope.logout = function () {
                $window.location.href = '/logout';
            };

            if (UserInfo.user.is_tutee) {
                $scope.tutee = Tutee.tutee;
            } else {
                $scope.tutee = Tutor.tutor;
            }

            $scope.goToMakeMatches = function () {
                $state.go('makeMatches');
            };

            $scope.goToEditTutees = function () {
                $state.go('editTutees');
            };

            $scope.goToEditTutors = function () {
                $state.go('editTutors');
            };

            $scope.goToManageAdmins = function () {
                $state.go('manageAdmins');
            };

            $scope.goToViewMatches = function () {
                $state.go('viewMatches');
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.EditTutorsController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutor',
        '$state',
        '$window',
        '$modal',
        function ($scope, UserInfo, Tutor, $state, $window, $modal) {
            if (!(UserInfo.hasInfo && UserInfo.user.is_staff)) {
                $state.go('home');
            }

            $scope.logout = function () {
                $window.location.href = '/logout';
            };

            $scope.goHome = function () {
                $state.go('home');
            };

            $scope.tuts = null;
            Tutor.getAllTutors(
                function cb(data) {
                    $scope.tuts = data;
                },
                function err() {
                    console.error('Unable to get all tutors');
                }
            );

            $scope.editTutor = function (user) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/app/partials/edit-user-modal.html',
                    controller: 'LCSTutoringApp.controllers.EditUserModalController',
                    size: 'md',
                    resolve: {
                        user: function () {
                            return user;
                        },
                        userType: function () {
                            return 'Tutor';
                        }
                    }
                });

                modalInstance.result.then(function okay() {

                }, function dismiss() {

                });
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.EditTuteesController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutee',
        '$state',
        '$window',
        '$modal',
        function ($scope, UserInfo, Tutee, $state, $window, $modal) {
            if (!(UserInfo.hasInfo && UserInfo.user.is_staff)) {
                $state.go('home');
            }

            $scope.logout = function () {
                $window.location.href = '/logout';
            };

            $scope.goHome = function () {
                $state.go('home');
            };

            $scope.tuts = null;
            Tutee.getAllTutees(
                function cb(data) {
                    $scope.tuts = data;
                },
                function err() {
                    console.error('Unable to get all tutors');
                }
            );

            $scope.editTutee = function (user) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/app/partials/edit-user-modal.html',
                    controller: 'LCSTutoringApp.controllers.EditUserModalController',
                    size: 'md',
                    resolve: {
                        user: function () {
                            return user;
                        },
                        userType: function () {
                            return 'Tutee';
                        }
                    }
                });

                modalInstance.result.then(function okay() {

                }, function dismiss() {

                });
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.EditAdminsController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutor',
        '$state',
        '$window',
        '$modal',
        function ($scope, UserInfo, Tutor, $state, $window, $modal) {
            if (!(UserInfo.hasInfo && UserInfo.user.is_staff)) {
                $state.go('home');
            }

            $scope.logout = function () {
                $window.location.href = '/logout';
            };

            $scope.goHome = function () {
                $state.go('home');
            };

            $scope.tuts = null;
            Tutor.getAllAdmins(
                function cb(data) {
                    $scope.tuts = data;
                },
                function err() {
                    console.error('Unable to get all tutors');
                }
            );

            $scope.editAdmin = function (user) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/app/partials/edit-user-modal.html',
                    controller: 'LCSTutoringApp.controllers.EditUserModalController',
                    size: 'md',
                    resolve: {
                        user: function () {
                            return user;
                        },
                        userType: function () {
                            return 'Admin';
                        }
                    }
                });

                modalInstance.result.then(function okay(okayString) {

                }, function dismiss() {

                });
            };

            $scope.addNewAdmin = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/app/partials/new-admin-modal.html',
                    controller: 'LCSTutoringApp.controllers.NewAdminModalController',
                    size: 'md',
                    resolve: {}
                });

                modalInstance.result.then(function okay() {
                    Tutor.getAllAdmins(
                        function cb(data) {
                            $scope.tuts = data;
                        },
                        function err() {
                            console.error('Unable to get all tutors');
                        }
                    );
                }, function dismiss() {

                });
            };

            $scope.revokeAdmin = function (user) {
                if ($window.confirm('Are you sure you want to remove ' + user.user.first_name +
                    ' as an admin?')) {
                    Tutor.revokeAdmin(user, function () {
                        console.log('Revoked admin privileges for ' + user.user.first_name + '.');
                        Tutor.getAllAdmins(
                            function cb(data) {
                                $scope.tuts = data;
                            },
                            function err() {
                                console.error('Unable to get all tutors');
                            }
                        );
                    }, function (error) {
                        $window.alert('Failed to revoke admin privileges for ' + user.user.first_name +
                        ' with error: ' + error);
                        console.error('Failed to revoke admin privileges for ' + user.user.first_name + '.');
                    });
                }
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.EditUserModalController', [
        '$scope',
        '$modalInstance',
        'LCSTutoring.services.Subjects',
        'LCSTutoring.services.Tutor',
        'LCSTutoring.services.Tutee',
        'user',
        'userType',
        '$window',
        function ($scope, $modalInstance, Subjects, Tutor, Tutee, user, userType, $window) {

            $scope.user = user;
            $scope.userType = userType;

            $scope.subjectChoices = Subjects.subjects;

            $scope.$watch(function () {
                return JSON.stringify($scope.subjectChoices);
            }, function () {
                if ($scope.subjectChoices.length > 0) {
                    preSelectSubjects();
                }
            });

            var preSelectSubjects = function () {
                var preSelectedSubjects = [];
                $scope.user.subjects.forEach(function (userSub) {
                    $scope.subjectChoices.forEach(function (subChoice) {
                        if (subChoice.id === userSub.id) {
                            preSelectedSubjects.push(subChoice);
                        }
                    });
                });
                $scope.user.subjects = preSelectedSubjects;
            };


            var getSubmittableUser = function (user) {
                // Copy the user object
                var newUser = JSON.parse(JSON.stringify(user));

                // Prepare subjects field
                newUser.subjects = newUser.subjects.map(function (subObj) {
                    return subObj.id;
                });

                // TODO: Prepare user field if need be
                return newUser;
            };

            $scope.ok = function () {
                if ($scope.userType === 'Tutor' || $scope.userType === 'Admin') {
                    Tutor.saveTutor(getSubmittableUser($scope.user), function () {
                        console.log('updated');
                    }, function () {
                        $window.alert('Sorry, but there was an error updating this account.' +
                        ' Please refresh the page and try again.');
                        console.error('error updating account');
                    });
                } else if ($scope.userType === 'Tutee') {
                    Tutee.saveTutee(getSubmittableUser($scope.user), function () {
                        console.log('updated');
                    }, function () {
                        $window.alert('Sorry, but there was an error updating this account.' +
                        ' Please refresh the page and try again.');
                        console.error('error updating account');
                    });
                }

                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.NewAdminModalController', [
        '$scope',
        '$modalInstance',
        '$window',
        'LCSTutoring.services.Tutor',
        function ($scope, $modalInstance, $window, Tutor) {

            $scope.tutorList = Tutor.getAllTutors(function (data) {
                $scope.tutorList = data;
            }, function () {
                console.error('Unable to fetch tutors');
            });

            $scope.addAdmin = function (newAdmin) {
                Tutor.addAdmin(newAdmin, function () {
                    console.log('New admin added successfully');
                    $modalInstance.close();
                }, function () {
                    console.error('Unable to add new admin');
                });
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            };
        }]);

    controllers.controller('LCSTutoringApp.controllers.MakeMatchesController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutor',
        'LCSTutoring.services.Tutee',
        '$state',
        '$window',
        '$modal',
        function ($scope, UserInfo, Tutor, Tutee, $state, $window, $modal) {
            if (!(UserInfo.hasInfo && UserInfo.user.is_staff)) {
                $state.go('home');
            }

            $scope.goHome = function () {
                $state.go('home');
            };

            $scope.tutees = null;
            Tutee.getAllTutees(
                function cb(data) {
                    $scope.tutees = data;
                },
                function err() {
                    console.error('Unable to get all tutees');
                }
            );

            $scope.tutors = null;
            Tutor.getAllTutors(
                function cb(data) {
                    $scope.tutors = data;
                },
                function err() {
                    console.error('Unable to get all tutors');
                }
            );

            $scope.tutorToMatch = null;
            $scope.tuteeToMatch = null;

            $scope.tutorFilterCriteria = {
                gender: null,
                sat_help: null,
                showAlreadyMatched: false
            };

            $scope.tuteeFilterCriteria = {
                gender: null,
                sat_help: null,
                showAlreadyMatched: false
            };

            $scope.tutFilter = function (tut, criteria) {
                // Initialize to true in case there is no pertinent criteria
                var genderMatches = true;
                var satMatches = true;
                var matched = true;

                if (criteria.gender !== null) {
                    genderMatches = tut.gender === criteria.gender;

                    if (criteria.gender === 'other') {
                        genderMatches = tut.gender !== 'female' && tut.gender !== 'male';
                    }
                }

                if (criteria.sat_help !== null) {
                    satMatches = tut.sat_help === criteria.sat_help;
                }

                // Hide matched tutors/tutees
                if (tut.matches.length > 0) {
                    matched = false;
                }

                if (criteria.showAlreadyMatched !== null) {
                    if (criteria.showAlreadyMatched) {
                        matched = criteria.showAlreadyMatched;
                    }
                }

                return genderMatches && satMatches && matched;
            };

            $scope.tutorFilter = function (tutor) {
                return $scope.tutFilter(tutor, $scope.tutorFilterCriteria);
            };

            $scope.tuteeFilter = function (tutee) {
                return $scope.tutFilter(tutee, $scope.tuteeFilterCriteria);
            };

            $scope.makeMatch = function () {
                if (!$scope.tutorToMatch || !$scope.tuteeToMatch) {
                    return;
                }

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/app/partials/make-match-modal.html',
                    controller: 'LCSTutoringApp.controllers.MakeMatchModalController',
                    size: 'lg',
                    resolve: {
                        tutor: function () {
                            return $scope.tutorToMatch;
                        },
                        tutee: function () {
                            return $scope.tuteeToMatch;
                        }
                    }
                });

                modalInstance.result.then(function okay(match) {
                    if (match !== null) {
                        $scope.tutorToMatch.matches.push(match);
                        $scope.tuteeToMatch.matches.push(match);

                        $scope.tutorToMatch = null;
                        $scope.tuteeToMatch = null;
                    }
                }, function dismiss() {

                });
            };


        }]);

    controllers.controller('LCSTutoringApp.controllers.MakeMatchModalController', [
        '$scope',
        '$modalInstance',
        '$window',
        '$compile',
        'tutor',
        'tutee',
        '$templateCache',
        'LCSTutoring.services.Tutor',
        function ($scope, $modalInstance, $window, $compile, tutor, tutee, $templateCache, Tutor) {

            $scope.tutor = tutor;
            $scope.tutee = tutee;

            $scope.tutorEmailTemplate = $templateCache.get('/static/app/partials/tutor-email-template.html');
            $scope.tuteeEmailTemplate = $templateCache.get('/static/app/partials/tutee-email-template.html');

            $scope.tutorEmail = $compile($scope.tutorEmailTemplate)($scope);
            $scope.tuteeEmail = $compile($scope.tuteeEmailTemplate)($scope);


            // Use timeout of 0 to push to the end of the digest I think..
            $window.setTimeout(function () {
                $scope.tutorEmail = $scope.tutorEmail.text();
                $scope.tuteeEmail = $scope.tuteeEmail.text();

                $scope.$apply();
            }, 0);

            $scope.matchAndSend = function () {
                angular.element('.mm-modal-tmpl-outer-container')
                    .append('<h4 style="float: right">Sending...</h4>');
                Tutor.makeMatch(
                    tutor,
                    $scope.tutorEmail,
                    tutee,
                    $scope.tuteeEmail,
                    function (match) {
                        if (match.tutor_email_sent && match.tutee_email_sent) { // jshint ignore:line
                            $modalInstance.close(match);
                        } else {
                            $window.alert('There was an error sending emails:\n' +
                            match.tutor_email_error + '\n' +
                            match.tutee_email_error);
                        }
                    }, function () {
                        console.log('match failed');
                        $modalInstance.close(null);
                    });
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            };
        }]);

    return controllers;
});