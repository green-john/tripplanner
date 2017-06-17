"use strict";

(function() {
    angular.module('tripplanner')
        .controller('UserController', UserController);

    UserController.$inject = ['AuthService', 'UserService'];

    function UserController(AuthService, UserService) {
        var vm = this;

        vm.errors = [];
        vm.userList = [];

        vm.username = "";
        vm.password = "";
        vm.firstName = "";
        vm.lastName = "";

        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.getAllUsers = getAllUsers;
        vm.user = AuthService.getUser();
        console.log(vm.user);

        getAllUsers();

        ////////////////////////////////////////

        function createUser() {
            vm.errors = [];
            if (_isAuthorized()) {
                var userData = {
                    'username': vm.username,
                    'password': vm.password,
                    'first_name': vm.firstName,
                    'last_name': vm.lastName
                };
                if (checkFieldsAreNonEmpty(userData)) {
                    UserService.createUser(userData).then(function (user_data) {
                        alert("User successfully created with id: " + user_data['id']);
                        getAllUsers();
                    }, function (response) {
                        _handleErrors(response);
                    })
                }
            }
            else {
                vm.errors.push('User has no permissions to execute this action');
            }
        }

        function updateUser() {

        }

        function deleteUser() {

        }

        function getAllUsers() {
            vm.userList = [];
            if (_isAuthorized()) {
                UserService.getAllUsers().then(function (users) {
                    vm.userList = users;
                }, function (response) {
                    _handleErrors(response);
                });
            }
        }

        function _handleErrors(response) {
            vm.errors = [];
            if (response.errors) {
                response.errors.forEach(function (elt) {
                   vm.errors.push(elt);
                })
            }
            else {
                vm.errors.push(response);
            }
        }

        function _isAuthorized() {
            return AuthService.isAdmin() || AuthService.isManager();
        }

        function checkFieldsAreNonEmpty(data) {
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (!data[prop]) {
                        vm.errors(prop + " cannot be empty");
                        return false;
                    }
                }
            }
            return true;
        }
    }
})();