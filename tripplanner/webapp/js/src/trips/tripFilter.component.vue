<template lang="pug">
    div
        h2 Filter Trips
        div.filter-table
            form(@submit.prevent="filterTrips")
                input(v-model="filterDestination" placeholder="Destination")
                input(type="date" v-model="filterStartDate" placeholder="Start Date (dd/mm/yyyy)")
                input(type="date" v-model="filterEndDate" placeholder="End Date (dd/mm/yyyy)")

                button(@click.prevent="filterTrips") Get Trips

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
        }
    }

    // TODO: display errors
</script>

<style lang="scss" scoped>
    $gray-border: rgba(203,203,210,0.4);

    div {
        div.filter-table {
            background-color: #fff;
            display: grid;
            grid-template-rows: 1fr 5fr;

            form {
                display: flex;
                flex-wrap: wrap;

                & > * {
                    flex: 1;
                }

                input {
                    border: 2px solid $gray-border;
                    border-radius: .3rem;
                    box-shadow: inset 0 1px 2px $gray-border;
                    font-size: 1rem;
                    height: 2rem;
                    outline: none;
                }
            }
        }
    }
</style>