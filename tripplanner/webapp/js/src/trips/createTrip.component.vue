<template lang="pug">
    div
        h2 Create Trip

        transition
            p.status.success(v-if="successMsg") {{ successMsg }}

        p.status.error(v-if="errors" v-for="error in errors") {{ error }}
        form(@submit.prevent="createTrip")
            label(for="destination") Destination
            input(id="destination" v-model="destination" placeholder="Destination")
            label(for="startDate") Start:
            input(id="startDate" type="date", placeholder="Start Date (dd/mm/yyyy)" v-model="start_date")
            label(for="endDate") End:
            input(id="endDate" type="date", placeholder="End Date (dd/mm/yyyy)" v-model="end_date")
            label(for="comment") Comments
            textarea(id="comment" v-model="comment" placeholder='asdf')

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

                successMsg: null,
                errors: []
            }
        },

        methods: {
            createTrip() {
                this.successMsg = null;
                this.errors = [];

                const tripData = Object.create(null);
                tripData.destination = this.destination;
                tripData.start_date = formatDate(this.start_date);
                tripData.end_date = formatDate(this.end_date);
                tripData.comment = this.comment;

                if (!this._validateFields(tripData)) {
                    return;
                }

                this.$trips.createTrip(tripData).then(() => {
                    this.successMsg = "Trip to " + this.destination + " created!";
                    this.destination = "";
                    this.start_date = "";
                    this.end_date = "";
                    this.comment = "";
                }).catch(response => {
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
                this.errors = [response.data.statusText];
            }
        }
    }


    // TODO: Display the errors
</script>

<style lang="scss" scoped>
    @import "~style/globals";

    div {
        border-radius: .3rem;
        background: #fff;

        h2 {
            padding: .5rem;
        }

        .status {
            border-radius: .2rem;
            color: white;
            display: block;
            margin: .2rem .3rem;
            padding: .3rem;
            text-align: center;
        }

        .error {
            background-color: $blood-color;
        }

        .success {
            background-color: $grass-color;
        }

        form {
            display: grid;
            grid-template-columns: auto 1fr;
            padding: .3rem;

            label, input, textarea {
                height: 2rem;
                margin: .2rem;
                padding: .2rem;
            }

            input {
                border: 1px solid #ddd;
                font-size: 1rem;
            }

            textarea {
                border: 1px solid #ddd;
                font-size: 1rem;
                height: 4rem;
            }

            button {
                background-color: $color2;
                border-radius: .3rem;
                color: #fff;
                font-size: 1rem;
                grid-column: 1 / -1;
                height: 3rem;
                margin-top: .2rem;
                padding: .5rem;
            }
        }
    }

    .success-enter-active, .success-leave-active {
        transition: opacity .3s ease;
    }

    .success-enter, .success-leave-to {
        opacity: 0;
    }
</style>