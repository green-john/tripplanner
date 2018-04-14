<template lang="pug">
  section
      div.errors
          p.individualError(v-for="error in errors") {{ error }}

      div.trip-filter
          trip-filter(:$trips="this.$trips")

      nav
          button.add(@click="showCreate = !showCreate")
              span.fas.fa-external-link-alt
              span Add

      transition(name='slide-down')
          div.modal(v-show='showCreate' @click="showCreate = !showCreate")
              div.modal-wrapper(@click.stop="")
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
        padding: 1rem;

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
                margin: 2rem;
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