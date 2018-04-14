<template lang="pug">
    div.trip
        label.start-date
            label.rotate-45.fas.fa-plane
            label {{ trip.start_date }}
        label.end-date
            label {{ trip.end_date }}
            label.rotate-135.fas.fa-plane
        label.destination Trip to {{trip.destination}}
        label.days-left(v-if="trip.days_left") Go in {{trip.days_left}} day(s)
        label.in-progress(v-else-if="trip.in_progress") In progress
        label.overdue(v-else) Finished

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
    @import "~style/globals";

    div {
        display: grid;
        align-items: center;
        justify-items: start;
        grid-gap: 0 .2rem;
        grid-template-areas:
            "sdate dest left"
            "edate dest left";
        grid-template-columns: auto 2fr 1.7fr;

        label.start-date {
            color: $sky-color;
            font-size: .8rem;
            grid-area: sdate;
        }

        label.end-date {
            color: $ground-color;
            font-size: .8rem;
            grid-area: edate;
        }

        label.destination {
            align-items: center;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            display: grid;
            font-size: .95rem;
            grid-area: dest;
            height: 100%;
            padding: 0 .1rem;
            width: 100%;
        }

        label.days-left {
            color: $sky-color;
            font-size: .9rem;
            grid-area: left;
        }

        label.in-progress {
            color: $grass-color;
            font-size: .9rem;
            grid-area: left;
        }

        label.overdue {
            color: $ground-color;
            font-size: .9rem;
            grid-area: left;
        }
    }

    label.fas {
        font-size: .7rem;
    }

    .rotate-45 {
        transform: rotate(-90deg);
    }

    .rotate-135 {
        transform: rotate(90deg);
    }

</style>