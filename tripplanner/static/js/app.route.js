"use strict";

(() => {
    angular.module('tripplanner')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];


    function routeConfig($stateProvider, $urlRouterProvider) {
        let landingState = {
            url: '/',
            title: 'TripPlanner',
            templateUrl: 'js/landing.html'
        };

        let tripState = {
            url: '/trips',
            templateUrl: 'js/trips/landing.html',
            title: 'Trips | TripPlanner',
            redirectTo: 'trips.initialize'
        };

        let loginState = {
            url: '/login',
            templateUrl: 'js/login/landing.html',
            title: 'Login | TripPlanner',
            redirectTo: 'login.initialize'
        };

        let notFound = {
            url: '/404',
            templateUrl: 'js/404.html',
            title: '404 Not Found | TripPlanner',
            errorPage: true
        };

        $urlRouterProvider.otherwise('/404');
        $stateProvider.state(landingState);
        $stateProvider.state(tripState);
        $stateProvider.state(loginState);
        $stateProvider.state(notFound);
    }
})();