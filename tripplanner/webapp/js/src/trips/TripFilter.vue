<template>
    <div>
        <h2>Filter Trips</h2>
        <form @submit.prevent="filterTrips">
            <input v-model="filterDestination" placeholder="Destination"><br>
            <input type="date" v-model="filterStartDate" placeholder="Start Date (dd/mm/yyyy)"><br>
            <input type="date" v-model="filterEndDate" placeholder="End Date (dd/mm/yyyy)"><br>

            <button @click.prevent="filterTrips">Get Trips</button>
        </form>

        <div>
            <ul>
                <li v-for="trip in trips">
                    <label>
                        Trip to {{trip.destination}} in {{trip.start_date}}.
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {formatDate} from 'utils/dates';

    export default {
        name: 'trip-filter',

        props: {
            $login: Object,
            $trips: Object
        },

        data() {
            return {
                trips: [],

                filterDestination: "",
                filterStartDate: "",
                filterEndDate: "",

                user: this.$login.getUser(),
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
                this.errors = [];
                const error = response.data.error;
                if (error) {
                    this.errors.push(error);
                }
                else {
                    this.errors.push(response);
                }
            }
        }
    }

</script>