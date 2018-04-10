<template lang="pug">

    div
        h2 Filter Trips
        form(@submit.prevent="filterTrips")
            input(v-model="filterDestination" placeholder="Destination")
            input(type="date" v-model="filterStartDate" placeholder="Start Date (dd/mm/yyyy)")
            input(type="date" v-model="filterEndDate" placeholder="End Date (dd/mm/yyyy)")

            button(@click.prevent="filterTrips") Get Trips

        div
            trip-list(:trip-list="this.trips")
</template>

<script>
    import {formatDate} from 'utils/dates';

    export default {
        name: 'trip-filter',

        props: {
            $trips: Object
        },

        data() {
            return {
                trips: [],

                filterDestination: "",
                filterStartDate: "",
                filterEndDate: "",
            }
        },

        methods: {
            filterTrips() {
                this.trips = [];
                const query = this._buildFilterQuery();

                this.$trips.filterTrips(query).then(trips => {
                    this.trips = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            _buildFilterQuery() {
                const data = Object.create(null);
                data.destination = this.filterDestination;
                data.start_date = formatDate(this.filterStartDate);
                data.end_date = formatDate(this.filterEndDate);

                return data;
            },

            _handleErrors(response) {
                this.errors = [response.data.error];
            }
        }
    }

    // TODO: display errors
</script>