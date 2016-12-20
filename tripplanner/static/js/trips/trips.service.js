"use strict";


(function () {
    angular.module('tripplanner')
        .factory('TripService', TripService);

    TripService.$inject = ['$http', 'AuthService'];

    function TripService($http, AuthService) {
        return {
            createTrip: createTrip,
            getAllTrips: getAllTrips,
            filterTrips: filterTrips
        };

        ////////////////////////////////////////////

        function createTrip(tripData) {
            var config = {
                headers: AuthService.getAuthorizationHeader()
            };

            return $http.post('/trips/', JSON.stringify(tripData), config).then(
                function success(response) {
                    return response.data;
                },
                function failure(response) {
                    throw response;
                }
            );
        }

        function getAllTrips() {
            var config = {
                headers: AuthService.getAuthorizationHeader()
            };

            return $http.get('/trips/', config).then(
                function success(response) {
                    return response.data;
                },
                function failure(response) {
                    throw response;
                }
            );
        }

        function filterTrips(params) {
            var config = {
                headers: AuthService.getAuthorizationHeader()
            };

            return $http.post('/trips/filter/', JSON.stringify(params), config).then(
                function success(response) {
                    return response.data;
                },
                function failure(response) {
                    throw response;
                }
            )
        }
    }
})();