<template>
    <div id="app">
        <h1>Trip Planner</h1>
        <router-link id="logout" :to="{name: 'logout'}">Logout</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'tripplanner'
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    #logout {
        position: fixed;
        top: 5px;
        right: 5px;
        background-color: #ff3faa;
        color: #fff;
    }
</style>
