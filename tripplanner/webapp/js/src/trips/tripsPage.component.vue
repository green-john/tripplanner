<template lang="pug">
  section
      h2 List of trips
      div.trip-filter
          trip-filter(:$trips="this.$trips")

      nav
          button.add(@click="toggleDialog")
              span.fas.fa-external-link-alt
              span Add

      transition(name='slide-down')
          div.modal(v-show='showCreate' @click="toggleDialog")
              div.modal-wrapper(@click.stop="")
                  span.close-btn.far.fa-times-circle(@click="showCreate = false")
                  create-trip(:$trips="this.$trips")

      div.upcoming-trips
          upcoming-trips(:$trips="this.$trips")

</template>

<script>
    import TripList from 'trips/tripList.component';
    import TripFilter from 'trips/tripFilter.component';
    import UpcomingTrips from 'trips/upcomingTrips.component';
    import CreateTrip from 'trips/createTrip.component';

    export default {
        name: 'trips',

        props: {
            $trips: Object
        },

        data() {
            return {
                showCreate: false
            }
        },

        methods: {
            toggleDialog() {
                this.showCreate = !this.showCreate;
            }
        },

        components: {
            'trip-list': TripList,
            'create-trip': CreateTrip,
            'trip-filter': TripFilter,
            'upcoming-trips': UpcomingTrips
        },
    };

</script>

<style lang="scss" scoped>
    @import "~style/globals";

    section {
        display: grid;
        background-color: $white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        padding: 1rem;
        margin: 1rem 5%;

        nav {
            display: grid;

            button {
                justify-self: end;
                margin-top: .3rem;

                span {
                    padding: 0 .2rem;
                }
            }
        }

        div.trip-filter {
            width: 100%;
        }

        div.modal {
            background-color: rgba(0, 0, 0, .5);
            height: 100vh;
            position: fixed;
            right: 0;
            top: 0;
            width: 100vw;

            div.modal-wrapper {
                margin: 2rem auto;
                max-width: 20rem;
                position: relative;

                span.close-btn {
                    background-color: $color2;
                    border-radius: 49%;
                    color: $white;
                    font-size: 1.2rem;
                    position: absolute;
                    right: -5;
                    top: -5;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .slide-down-enter-active, .slide-down-leave-active {
        transition: opacity .3s ease;
    }

    .slide-down-enter, .slide-down-leave-to {
        opacity: 0;
    }
</style>