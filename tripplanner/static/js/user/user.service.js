"use strict";

(function () {
    angular.module('tripplanner')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'AuthService'];

    function UserService($http, AuthService) {
        return {
            createUser: createUser,
            getAllUsers: getAllUsers
        };

        /////////////////////////////////////////

        function createUser(userData) {
            var config = {
                headers: AuthService.getAuthorizationHeader()
            };

            return $http.post('/users/', JSON.stringify(userData), config).then(
                function success(response) {
                    return response.data;
                },
                function failure(response) {
                    throw response;
                }
            );
        }

        function getAllUsers() {
            var config = {
                headers: AuthService.getAuthorizationHeader()
            };

            return $http.get('/users/', config).then(
                function success(response) {
                    return response.data;
                },
                function failure(response) {
                    throw response;
                }
            );
        }
    }
})();