<template>
    <div class='col-xs-offset-1'>
        <div class="row">
            <div class="col-xs-11">
                <div class="individualError" v-for="error in errors">
                    {{error}}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <h2>List of Trips</h2>
                <ul>
                    <li v-for="trip in tripList">
                        <label>Trip to {{trip.destination}}  in {{trip.start_date}}.</label>
                        <label style="color: blue" v-if="trip.days_left">
                            {{trip.days_left}} day(s) left.
                        </label>
                        <label style="color: red" v-else>
                            Overdue.
                        </label>
                    </li>
                </ul>
            </div>
            <div class="col-xs-2">
                <h2>Create Trip</h2>
                <form @submit.prevent="createTrip">
                    <input v-model="destination" placeholder="Destination"><br>
                    <input type="date" placeholder="Start Date (dd/mm/yyyy)" v-model="start_date"><br>
                    <input type="date" placeholder="End Date (dd/mm/yyyy)" v-model="end_date"><br>
                    <input v-model="comment" placeholder="Comment"><br>

                    <button @click.prevent="createTrip">Create Trip</button>
                </form>
            </div>

            <div class="cols-x-3">
                <h2>Filter Trips</h2>
                <form @submit.prevent="filterTrips">
                    <input v-model="filter_destination" placeholder="Destination"><br>
                    <input type="date" v-model="filter_start_date" placeholder="Start Date (dd/mm/yyyy)"><br>
                    <input type="date" v-model="filter_end_date" placeholder="End Date (dd/mm/yyyy)"><br>

                    <button @click.prevent="filterTrips">Get Trips</button>
                </form>
            </div>

            <div class="col-xs-4">
                <ul>
                    <li v-for="trip in filteredTrips">
                        <label>
                            Trip to {{trip.destination}} in {{trip.start_date}}.
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-11">
                <h2>Next Month's Itinerary</h2>
                <ul>
                    <li v-for="trip in nextMonthItinerary">
                        <label>
                            Trip to {{trip.destination}} in {{trip.start_date}}.
                        </label>
                    </li>
                </ul>

                <button @click="getNextMonthItinerary">Refresh</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'trips',

        props: {
            $login: Object,
            $trips: Object
        },

        data() {
            return {
                errors: [],
                tripList: [],
                nextMonthItinerary: [],
                filteredTrips: [],

                destination: "",
                start_date: "",
                end_date: "",
                comment: "",

                filter_destination: "",
                filter_start_date: "",
                filter_end_date: "",

                user: this.$login.getUser(),

                showStartDate: false,
                showEndDate: false,
                showFilterStartDate: false,
                showFilterEndDate: false,
            }
        },

        created() {
            this.getAllTrips();
            this.getNextMonthItinerary();
        },

        methods: {
            createTrip() {
                this.errors = [];
                const tripData = this._buildTripData();

                console.log(tripData);

                if (this._validate(tripData)) {
                    this.$trips.createTrip(tripData).then(tripData => {
                        alert("Trip created with id: " + tripData['id'] + " for " + tripData['start_date']);
                        this.getAllTrips();
                    }).catch(response => {
                        this._handleErrors(response);
                    });
                }
            },

            filterTrips() {
                this.filteredTrips = [];
                const query = this._buildFilterQuery();

                this.$trips.filterTrips(query).then(trips => {
                    this.filteredTrips = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            getNextMonthItinerary() {
                this.nextMonthItinerary = [];
                this.$trips.getNextMonthItinerary().then(trips => {
                    this.nextMonthItinerary = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            getAllTrips() {
                this.tripList = [];
                this.$trips.getAllTrips().then(trips => {
                    this.tripList = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
            },

            _buildTripData() {
                const data = Object.create(null);
                data.destination = this.destination;
                data.start_date = this._convertDate(this.start_date);
                data.end_date = this._convertDate(this.end_date);
                data.comment = this.comment;
                data.user_id = this.user['id'];

                return data;
            },

            _buildFilterQuery() {
                const data = Object.create(null);
                data.destination = this.filter_destination;
                data.start_date = this._convertDate(this.filter_start_date);
                data.end_date = this._convertDate(this.filter_end_date);

                return data;
            },

            _convertDate(date) {
                if (!date) {
                    return "";
                }
                const d = new Date(date);
                const day = d.getDate() + 1;
                const month = d.getMonth() + 1;
                return `${day}/${month}/${d.getFullYear()}`;
            },

            _validate(data) {
                for (let prop in data) {
                    if (!data[prop]) {
                        this.errors.push(prop + " cannot be empty");
                        return false;
                    }
                }
                return true;
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
    };
</script>