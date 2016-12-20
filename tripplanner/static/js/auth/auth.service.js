'use strict';

(function() {
    angular.module('tripplanner')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', 'SerializerService'];

    function AuthService($http, SerializerService) {
        return {
            authenticate: authenticate
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
                return response.data;
            }, function failure(response) {
                throw response;
            });
        }
    }
})();