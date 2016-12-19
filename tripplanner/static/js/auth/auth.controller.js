"use strict";

(() => {
    angular.module('tripplanner')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService'];

    function AuthController(AuthService) {
        let vm = this;

        // Constants

        vm.EMPTY_USERNAME_ERROR = 'Username must be non-empty.';
        vm.EMPTY_PASSWORD_ERROR = 'Password must be non-empty.';

        vm.username = "";
        vm.password = "";
        vm.errors = [];
        vm.user = undefined;

        vm.login = login;

        ///////////////////////

        function login() {
            let localErrors = [];
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

            AuthService.authenticate(vm.username, vm.password).then((user) => {
                vm.user = user;
            }, (response) => {
                _handleErrors(response);
            });
        }

        function _handleErrors(response) {
            vm.errors = [];
            if (response.errors) {
                response.errors.forEach((error) => {
                    vm.errors.push(error);
                })
            }
            else {
                vm.errors.push(response);
            }
        }
    }
})();