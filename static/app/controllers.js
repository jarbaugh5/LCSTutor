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
            $scope.formData.tuteePhone = '';
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
                        'tutee_phone': $scope.formData.tuteePhone,
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
                    function () {
                        console.error('Error posting tutee signup data');
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
                    function () {
                        console.error('Error posting tutee signup data');
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
        function ($scope, UserInfo, Tutor, $state, $window) {
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
        }]);

    controllers.controller('LCSTutoringApp.controllers.EditTuteesController', [
        '$scope',
        'LCSTutoring.services.UserInfo',
        'LCSTutoring.services.Tutee',
        '$state',
        '$window',
        function ($scope, UserInfo, Tutee, $state, $window) {
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

            $scope.revokeAdmin = function (user) {
                if ($window.confirm('Are you sure you want to remove ' + user.user.first_name +
                    ' as an admin?')) {
                    Tutor.revokeAdmin(user, function () {
                        console.log('Revoked admin privileges for ' + user.user.first_name + '.');
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
        'user',
        'userType',
        '$window',
        function ($scope, $modalInstance, Subjects, Tutor, user, userType, $window) {

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
                Tutor.saveTutor(getSubmittableUser($scope.user), function () {
                    console.log('updated');
                }, function () {
                    $window.alert('Sorry, but there was an error updating this admin account.' +
                    ' Please refresh the page and try again.');
                    console.error('error updating admin');
                });
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    return controllers;
});