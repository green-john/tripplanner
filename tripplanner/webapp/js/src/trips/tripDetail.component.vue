<template lang="pug">
    div.trip
        label Trip to {{destination}} in {{start_date}}.
        label.days-left(v-if="days_left") {{days_left}} day(s) left.
        label.overdue(v-else) Overdue.

</template>

<script>
    export default {
        name: "trip-detail",

        props: {
            destination: String,
            start_date: String,
            days_left: Number,
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