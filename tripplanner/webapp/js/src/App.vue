<template lang="pug">
    div#app
        h1 Trip Planner
        router-view
</template>

<script>
    export default {
        name: 'tripplanner'
    }
</script>

<style scoped>
    h1 {
        margin: 1rem;
    }
</style>

