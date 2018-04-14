<template lang="pug">
    div
        div.filter-table
            form(@submit.prevent="filterTrips")
                input(id="startDate" type="date" value="Start date" v-model="filterStartDate" placeholder="Start Date (dd/mm/yyyy)")
                input(id ="endDate" type="date" v-model="filterEndDate" placeholder="End Date (dd/mm/yyyy)")
                input(id="destination" v-model="filterDestination" placeholder="Destination")

                button(id="filterBtn" @click.prevent="filterTrips")
                    span.fas.fa-filter

            trip-list(:trip-list="this.trips")
</template>

<script>
    import { formatDate } from 'utils/dates';
    import TripList from 'trips/tripList.component';

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

        components: {
            'trip-list': TripList
        },

        methods: {
            filterTrips() {
                this.trips = [];
                const query = this._buildFilterQuery();

                this.$trips.filterTrips(query).then(trips => {
                    console.log("Received", trips);
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
        },

        mounted() {
            this.filterTrips();
        }
    }

    // TODO: display errors
</script>

<style lang="scss" scoped>
    @import "~style/globals";

    div {
        div.filter-table {

            form {
                display: grid;
                grid-auto-flow: column;

                input {
                    background: none;
                    border: none;
                    border-left: 1px solid #bbb;
                    border-top: 1px solid #bbb;
                    font-size: .9rem;
                    height: 2rem;
                    padding: .2rem;
                    outline: none;

                    &:last-of-type {
                        border-right: 1px solid #bbb;
                    }
                }

                button {
                    font-size: .8rem;
                    padding: 0 .5rem;
                }
            }
        }
    }
</style>