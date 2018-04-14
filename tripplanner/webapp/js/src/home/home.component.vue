<template lang="pug">
    section
        div(v-if="user")
            p Welcome {{user.username}}. This is your home.

        ul
            li(v-if="isAdmin()")
                router-link(:to="{name: 'users'}") Manage Users
            li
                router-link(:to="{name: 'trips'}") Manage Trips
</template>

<script>
    export default {
        name: 'home-component',

        props: {
            $login: Object
        },

        methods: {
            isAdmin() {
                // user is added by the mixin
                return this.$login.isUserAdmin();
            }
        },

        computed: {
            user() {
                return this.$login.userInfo;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~style/globals";

    section {
        padding: 1rem;

        a {
            color: white;
            text-decoration: none;
        }

        ul {
            padding: .5rem;
            list-style: none;

            li {
                background-color: $color1;
                border-radius: .3rem;
                display: inline-block;
                padding: .5rem;
                margin: 0 .4rem;

                a {
                    color: $white;
                }
            }
        }
    }
</style>
