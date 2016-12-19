"use strict";

(() => {
    angular.module('tripplanner')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        let loginState = {
            url: '/login',
            templateUrl: '/static/js/auth/landing.html',
            title: 'Login | TripPlanner',
            controller: 'AuthController'
        };

        let notFound = {
            url: '/404',
            templateUrl: '/static/js/404.html',
            title: '404 Not Found | TripPlanner',
        };

        $stateProvider.state('login', loginState);
        $stateProvider.state('notFound', notFound);
    }
})();