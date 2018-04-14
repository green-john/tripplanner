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
    @import "~style/globals";

    h1 {
        color: $color2;
        margin: 1rem;
    }

    a {
        color: $color1;
        text-decoration: none;

        &#logout {
            top: 5px;
            right: 5px;
            position: absolute;
        }
    }
</style>

<style lang="scss">
    @import "~style/globals";

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background-color: $white;
        font-family: 'Roboto', Helvetica, sans-serif;
        font-size: 16px;

        button {
            background-color: $color2;
            border: none;
            border-radius: .3rem;
            color: $white;
            font-size: .9rem;
            padding: .5rem;
            outline: none;
        }
    }



    /*.individualError {*/
        /*background: red;*/
        /*-webkit-border-radius: 0.3em;*/
        /*-moz-border-radius: 0.3em;*/
        /*border-radius: 0.3em;*/

        /*padding: 0.3em;*/
        /*margin: 0.3em;*/
    /*}*/
</style>
