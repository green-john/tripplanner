"use strict";

(function () {
    angular.module('tripplanner')
        .run(setJsonType)
        .run(checkRouting);

    checkRouting.$inject = ['$rootScope', '$location', 'AuthService'];
    setJsonType.$inject = ['$http'];

    function checkRouting($rootScope, $location, AuthService) {
        var routesNoAuth = ['/login'];

        var requiresAuth = function(route) {
            if (route === '/') {
                return false;
            }
            var needsAuth = true;
            routesNoAuth.forEach(function (elt) {
                if (route.startsWth(elt)) {
                    needsAuth = false;
                }
            });
            return needsAuth;
        };

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (requiresAuth($location.url()) && !AuthService.userLoggedIn()) {
                $location.path('/login');
            }
        });

    }

    function setJsonType($http) {
        $http.defaults.headers.common['Content-Type'] = 'application/json'
    }
})();