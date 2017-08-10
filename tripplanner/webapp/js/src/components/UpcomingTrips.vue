<template>
    <div>
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
</template>

<script>
    export default {
        name: 'upcoming-trips',

        props: {
            $login: Object,
            $trips: Object
        },

        data() {
            return {
                nextMonthItinerary: [],

                user: this.$login.getUser()
            }
        },

        created() {
            this.getNextMonthItinerary();
        },

        methods: {
            getNextMonthItinerary() {
                this.nextMonthItinerary = [];
                this.$trips.getNextMonthItinerary().then(trips => {
                    this.nextMonthItinerary = trips;
                }).catch(response => {
                    this._handleErrors(response);
                });
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