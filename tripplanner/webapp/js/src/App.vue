<template lang="pug">
    div#app
        router-link#logout(:to="{name: 'logout'}") Logout
        h1 Trip Planner
        router-view
</template>

<script>
    export default {
        name: 'tripplanner'
    }
</script>

<style lang="scss" scoped>
    h1 {
        margin: 1rem;

    }

    a {
        color: white;
        text-decoration: none;

        &#logout {
            top: 5px;
            right: 5px;
            position: absolute;
        }
    }


</style>

