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
    $bg-color: #32414d;

    ul {
        li {
            color: $bg-color;
        }
    }
</style>