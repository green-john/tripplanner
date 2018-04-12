<template lang="pug">
    div.trip
        label Trip to {{trip.destination}} in {{trip.start_date}}.
        label.days-left(v-if="trip.days_left") {{trip.days_left}} day(s) left.
        label.overdue(v-else) Overdue.

</template>

<script>
    export default {
        name: "trip-detail",

        props: {
            trip: Object
        }
    }
</script>

<style lang="scss" scoped>
    div {
        label.days-left {
            color: blue;
        }

        label.overdue {
            color: red;
        }
    }
</style>