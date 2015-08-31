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

    return controllers;
});