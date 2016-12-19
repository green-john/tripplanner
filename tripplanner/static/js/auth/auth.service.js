'use strict';

(() => {
    angular.module('tripplanner')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', 'SerializerService'];

    function AuthService($http, SerializerService) {
        return {
            authenticate: authenticate
        };

        //////////////////////////

        function authenticate(username, password) {
            let authHeader = SerializerService.encodeBasicAuth(username, password);
            let config = {
                headers: {
                    'Authorization': authHeader
                }
            };

            $http.post('/token/', {}, config).then((response) => {
                return response.data;
            }, (response) => {
                throw response;
            });
        }
    }
})();