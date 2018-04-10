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
    import authMixin from "auth/auth.mixin";

    export default {
        name: 'home-component',

        mixins: [authMixin],

        methods: {
            isAdmin() {
                // user is added by the mixin
                if (this.user) {
                    return this.user.roles.indexOf("admin") !== -1;
                }
                return false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    $bg-color: #32414d;

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
                background-color: #fff;
                border-radius: .3rem;
                display: inline-block;
                padding: .5rem;
                margin: 0 .4rem;

                a {
                    color: $bg-color;
                }
            }
        }
    }
</style>
