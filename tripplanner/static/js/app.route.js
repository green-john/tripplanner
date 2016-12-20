"use strict";

(function() {
    angular.module('tripplanner')
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider', '$locationProvider'];

    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/static/js/landing.html'
        })
        .when('/home', {
            templateUrl: '/static/js/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: '/static/js/auth/landing.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        })
        .when('/users', {
            templateUrl: '/static/js/user/landing.html',
            controller: 'UserController',
            controllerAs: 'vm'
        })
        .when('/trips', {
            templateUrl: '/static/js/trips/landing.html',
            controller: 'TripController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }
})();