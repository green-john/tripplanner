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
        .when('/login', {
            templateUrl: '/static/js/auth/landing.html',
            controller: 'AuthController'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
    }
})();