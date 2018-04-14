<template lang="pug">
    ul
        li(v-for="trip in tripList" :key="trip.id" )
            trip-detail(:trip="trip")
</template>

<script>
    import TripDetail from "trips/tripDetail.component";

    export default {
        name: "trip-list",

        components: {
            "trip-detail": TripDetail
        },

        props: {
            tripList: Array
        }
    }
</script>

<style lang="scss" scoped>
    @import "~style/globals";

    ul {
        list-style: none;

        li {
            border-bottom: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-left: 1px solid #ddd;

            &:first-of-type {
                border-top: 1px solid #ddd;
            }
        }
    }
</style>