'use strict';

(function() {
    angular.module('tripplanner')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', 'SerializerService'];

    function AuthService($http, SerializerService) {

        var loggedIn = false;
        var userInfo = undefined;

        return {
            authenticate: authenticate,
            userLoggedIn: userLoggedIn,
            isAdmin: isAdmin,
            isManager: isManager,
            getAuthorizationHeader: getAuthorizationHeader,
            getUser: getUser
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
                console.log(userInfo);
                loggedIn = true;
                return response.data;
            }, function failure(response) {
                throw response;
            });
        }

        function userLoggedIn() {
            return loggedIn;
        }

        function isAdmin() {
            if (!userInfo) {
                return false;
            }
            return userInfo['roles'].indexOf('admin') !== -1;
        }

        function isManager() {
            if (!userInfo) {
                return false;
            }
            return userInfo['roles'].indexOf('manager') !== -1;
        }

        function getAuthorizationHeader() {
            var authHeader = SerializerService.encodeCredentialsTokenAuth(
                getUser()['token']);

            return {
                'Authorization': authHeader
            };
        }

        function getUser() {
            return userInfo;
        }
    }
})();