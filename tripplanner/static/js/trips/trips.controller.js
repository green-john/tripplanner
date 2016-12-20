"use strict";

(function() {
    angular.module('tripplanner')
        .controller('TripController', TripController);

    TripController.$inject = ['AuthService', 'TripService'];

    function TripController(AuthService, TripService) {
        var vm = this;

        vm.errors = [];
        vm.tripList = [];
        vm.upcomingTrips = [];
        vm.filteredTrips = [];

        vm.destination = "";
        vm.start_date = "";
        vm.end_date = "";
        vm.comment = "";

        vm.createTrip = createTrip;
        vm.updateTrip = updateTrip;
        vm.deleteTrip = deleteTrip;
        vm.getAllTrips = getAllTrips;
        vm.getUpcomingTrips = getUpcomingTrips;
        vm.filterTrips = filterTrips;

        vm.user = AuthService.getUser();

        getAllTrips();

        ////////////////////////////////////////

        function createTrip() {
            vm.errors = [];
            var tripData = {
                'destination': vm.destination,
                'start_date': vm.start_date,
                'end_date': vm.end_date,
                'comment': vm.comment,
                'user_id': vm.user['id']
            };
            if (checkFieldsAreNonEmpty(tripData)) {
                TripService.createTrip(tripData).then(function (tripData) {
                    alert("Trip created with id: " + tripData['id'] + " for " +
                        tripData['start_date']);
                    getAllTrips();
                }, function (response) {
                    _handleErrors(response);
                })
            }
        }

        function updateTrip() {

        }

        function deleteTrip() {

        }

        function getAllTrips() {
            vm.tripList = [];
            TripService.getAllTrips().then(function (trips) {
                vm.tripList = trips;
            }, function (response) {
                _handleErrors(response);
            });
        }

        function getUpcomingTrips() {
            vm.upcomingTrips = [];
            TripService.getUpcomingTrips().then(function (trips) {
                vm.upcomingTrips = trips;
            }, function (response) {
                _handleErrors(response);
            });
        }

        function filterTrips() {
            vm.filteredTrips = [];
            TripService.filterTrips().then(function (trips) {
                vm.upcomingTrips = trips;
            }, function (response) {
                _handleErrors(response);
            });
        }

        function _handleErrors(response) {
            vm.errors = [];
            if (response.errors) {
                response.errors.forEach(function (elt) {
                   vm.errors.push(elt);
                })
            }
            else {
                vm.errors.push(response);
            }
        }

        function checkFieldsAreNonEmpty(data) {
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (!data[prop]) {
                        vm.errors.push(prop + " cannot be empty");
                        return false;
                    }
                }
            }
            return true;
        }
    }
})();