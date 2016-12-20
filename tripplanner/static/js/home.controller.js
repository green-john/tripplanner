"use strict";

(function () {
    angular.module('tripplanner')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['AuthService'];

    function HomeController(AuthService) {
        var vm = this;

        vm.user = AuthService.getUser();
        vm.isAdmin = AuthService.isAdmin();
        vm.isManager = AuthService.isManager();
        vm.isRegular = true;
    }
})();