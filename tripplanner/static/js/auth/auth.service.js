'use strict';

(function() {
    angular.module('tripplanner')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', 'SerializerService'];

    function AuthService($http, SerializerService) {
        var userInfo = undefined;
        var loggedIn = false;

        return {
            authenticate: authenticate,
            getUserInfo: getUserInfo,
            userLoggedIn: userLoggedIn
        };

        //////////////////////////

        function authenticate(username, password) {
            var authHeader = SerializerService.encodeCredentialsBasicAuth(
                username, password);

            var config = {
                headers: {
                    'Authorization': authHeader
                }
            };

            return $http.post('/token/', {}, config)
            .then(function success(response) {
                userInfo = response.data;
                loggedIn = true;
                return response.data;
            }, function failure(response) {
                throw response;
            });
        }

        function getUserInfo() {
            return userInfo;
        }

        function userLoggedIn() {
            return loggedIn;
        }
    }
})();