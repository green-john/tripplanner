"use strict";

(function () {
    angular.module('tripplanner')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['AuthService'];

    function HomeController(AuthService) {
        var vm = this;

        vm.user = undefined;
        vm.isAdmin = false;
        vm.isManager = false;
        vm.isRegular = true;

        if (AuthService.userLoggedIn()) {
            vm.user = AuthService.getUserInfo();
            vm.isAdmin = vm.user['roles'].indexOf('admin') !== -1;
            vm.isManager = vm.user['roles'].indexOf('manager') !== -1;
        }
    }
})();