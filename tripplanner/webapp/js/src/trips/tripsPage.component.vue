<template lang="pug">
  section
      div.errors
          p.individualError(v-for="error in errors") {{ error }}

      div.create-trip
          create-trip(:$trips=this.$trips)

      div.trip-list
          trip-list(:trip-list="tripList")

      div.trip-filter
          trip-filter(:$trips=this.$trips)

      div.upcoming-trips
         upcoming-trips(:$trips=this.$trips)
</template>

<script>
    import TripList from "trips/tripList.component";
    import TripFilter from 'trips/tripFilter.component';
    import UpcomingTrips from 'trips/upcomingTrips.component';
    import CreateTrip from 'trips/createTrip.component';
    import AuthCheck from 'auth/auth.mixin';

    export default {
        name: 'trips',

        mixin: [AuthCheck],

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

<style scoped>
    section {
        display: flex;
        flex-wrap: wrap;
    }

    section > article:first-child {
        width: 100%;
    }

    section > article:not(:first-child) {
        flex: 1;
    }

    ul {
        list-style: none;
    }
</style>