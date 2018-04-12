<template lang="pug">
    div
        h2 Create Trip
        label.status(v-model="status") &nbsp;
        form(@submit.prevent="createTrip")
            input(v-model="destination" placeholder="Destination")
            input(type="date", placeholder="Start Date (dd/mm/yyyy)" v-model="start_date")
            input(type="date", placeholder="End Date (dd/mm/yyyy)" v-model="end_date")
            input(v-model="comment" placeholder="Comment")

            button(@click.prevent="createTrip") Create Trip
</template>

<script>
    import { formatDate } from "../utils/dates";

    export default {
        name: "create-trip",

        props: {
            $trips: Object
        },

        data() {
            return {
                destination: "",
                start_date: "",
                end_date: "",
                comment: "",

                status: "",
                errors: []
            }
        },

        methods: {
            createTrip() {
                const tripData = Object.create(null);
                tripData.destination = this.destination;
                tripData.start_date = formatDate(this.start_date);
                tripData.end_date = formatDate(this.end_date);
                tripData.comment = this.comment;

                if (!this._validateFields(tripData)) {
                    this.status = "Error creating trip";
                    return;
                }

                this.$trips.createTrip(tripData).then(() => {
                    this.status = "Trip created!";
                }).catch(response => {
                    this.status = "Error creating trip";
                    this._handleErrors(response);
                });
            },

            _validateFields(fieldsToValidate) {
                this.errors = [];
                for (let k in fieldsToValidate) {
                    if (fieldsToValidate[k] === "") {
                        this.errors.push(k + " can't be empty");
                    }
                }

                return this.errors.length === 0;
            },

            _handleErrors(response) {
                this.errors = [response.data.error];
            }
        }
    }


    // TODO: Display the errors
</script>

<style lang="scss" scoped>
    $bg-color: #32414d;

    div {
        background: #fff;

        form {
            display: grid;

            & > * {
                display: block;
                font-size: 1rem;
                height: 2rem;
                margin: .3rem;
            }

            button {
                background-color: $bg-color;
                border-radius: .3rem;
                color: #fff;
                /*display: inline-block;*/
                /*padding: .5rem;*/
                /*margin: 0 .4rem;*/
            }
        }
    }
</style>