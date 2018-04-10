<template lang="pug">
    div
        h2 Next Month's Itinerary
        trip-list(:trip-list="nextMonthTrips")

        button(@click="getNextMonthItinerary") Refresh
</template>

<script>
    export default {
        name: 'upcoming-trips',

        props: {
            $trips: Object
        },

        data() {
            return {
                errors: [],
                nextMonthTrips: [],
            }
        },

        methods: {
            getNextMonthItinerary() {
                this.nextMonthTrips = [];
                this.$trips.getNextMonthItinerary().then(trips => {
                    this.nextMonthTrips = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            _handleErrors(response) {
                this.errors = [response.data.error];
            }
        },

        mounted() {
            this.getNextMonthItinerary();
        }
    }
</script>