<template lang="pug">
  section
      div.errors
          p.individualError(v-for="error in errors") {{ error }}

      // The trip filter already contains a trip list
      div.trip-filter
          trip-filter(:$trips="this.$trips")

      div.upcoming-trips
          upcoming-trips(:$trips="this.$trips")

      div.create-trip
          create-trip(:$trips="this.$trips")
</template>

<script>
    import TripList from "trips/tripList.component";
    import TripFilter from 'trips/tripFilter.component';
    import UpcomingTrips from 'trips/upcomingTrips.component';
    import CreateTrip from 'trips/createTrip.component';

    export default {
        name: 'trips',

        props: {
            $trips: Object
        },

        data() {
            return {
                errors: [],
                tripList: [],
            }
        },

        components: {
            'trip-list': TripList,
            'create-trip': CreateTrip,
            'trip-filter': TripFilter,
            'upcoming-trips': UpcomingTrips
        },

        methods: {
            getAllTrips() {
                this.tripList = [];
                this.$trips.getAllTrips().then(trips => {
                    this.tripList = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            _handleErrors(response) {
                this.errors = [];
                const responseData = response.data || response;
                if (responseData.error) {
                    this.errors.push(responseData.error);
                }
                else {
                    this.errors.push(responseData);
                }
            }
        },

        mounted() {
            this.getAllTrips();
        }
    };
</script>

<style lang="scss" scoped>
    section {
        display: grid;
        padding: 1rem;

        div.trip-filter {
            width: 100%;
        }

        div.create-trip {
            $div-width: 15rem;
            $div-offset: -($div-width + 1rem);

            position: fixed;
            right: $div-offset;
            width: $div-width;
        }
    }
</style>