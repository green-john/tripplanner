"use strict";

(function() {
    angular.module('tripplanner')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location'];

    function AuthController(AuthService, $location) {
        var vm = this;

        // Constants

        vm.EMPTY_USERNAME_ERROR = 'Username must be non-empty.';
        vm.EMPTY_PASSWORD_ERROR = 'Password must be non-empty.';

        vm.username = "";
        vm.password = "";
        vm.errors = [];

        vm.login = login;

        ///////////////////////

        function login() {
            console.log('Logging in');
            var localErrors = [];
            vm.errors = [];
            if (!vm.username) {
                localErrors.push(vm.EMPTY_USERNAME_ERROR);
            }

            if (!vm.password) {
                localErrors.push(vm.EMPTY_PASSWORD_ERROR);
            }

            if (localErrors.length > 0) {
                vm.errors = localErrors;
                return;
            }

            AuthService.authenticate(vm.username, vm.password)
                .then(function success(user) {
                    $location.path('/home');
                }, function failure(response) {
                    _handleErrors(response);
                });
        }

        function _handleErrors(response) {
            vm.errors = [];
            if (response.errors) {
                response.errors.forEach(function each(error) {
                    vm.errors.push(error);
                })
            }
            else {
                vm.errors.push(response);
            }
        }
    }
})();