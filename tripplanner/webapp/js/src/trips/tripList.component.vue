<template lang="pug">
    div
        h2 Trip List
        ul
            li(v-for="trip in tripList" :key="trip.id" )
                trip-detail(:data="trip")
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

<style scoped>

</style>