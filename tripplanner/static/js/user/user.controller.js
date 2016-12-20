"use strict";

(function() {
    angular.module('tripplanner')
        .controller('UserController', UserController);

    UserController.$inject = ['$http', 'AuthService'];

    function UserController($http, AuthService) {
        var vm = this;

        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        ////////////////////////////////////////

        function createUser() {

        }

        function updateUser() {

        }

        function deleteUser() {

        }
    }
})();