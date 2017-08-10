<template>
    <section>
        <article class="errors">
            <p class="individualError" v-for="error in errors">
                {{error}}
            </p>
        </article>

        <article>
            <h2>Create Trip</h2>
            <form @submit.prevent="createTrip">
                <input v-model="destination" placeholder="Destination"><br>
                <input type="date" placeholder="Start Date (dd/mm/yyyy)" v-model="start_date"><br>
                <input type="date" placeholder="End Date (dd/mm/yyyy)" v-model="end_date"><br>
                <input v-model="comment" placeholder="Comment"><br>

                <button @click.prevent="createTrip">Create Trip</button>
            </form>
        </article>

        <article>
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
        </article>

        <article>
            <trip-filter :$login=this.$login :$trips=this.$trips></trip-filter>
        </article>

        <article>
            <upcoming-trips :$login=this.$login :$trips=this.$trips></upcoming-trips>
        </article>
    </section>
</template>

<script>
    import {formatDate} from 'utils/dates';
    import TripFilter from 'components/TripFilter';
    import UpcomingTrips from 'components/UpcomingTrips';

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

                destination: "",
                start_date: "",
                end_date: "",
                comment: "",

                user: this.$login.getUser(),
            }
        },

        created() {
            this.getAllTrips();
        },

        components: {
            'trip-filter': TripFilter,
            'upcoming-trips': UpcomingTrips
        },

        methods: {
            createTrip() {
                this.errors = [];
                const tripData = this._buildTripData();

                if (this._validate(tripData)) {
                    this.$trips.createTrip(tripData).then(tripData => {
                        alert("Trip created with id: " + tripData['id'] + " for " + tripData['start_date']);
                        this.getAllTrips();
                    }).catch(response => {
                        this._handleErrors(response);
                    });
                }
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
                data.start_date = formatDate(this.start_date);
                data.end_date = formatDate(this.end_date);
                data.comment = this.comment;
                data.user_id = this.user['id'];

                return data;
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