<template lang="pug">
    section
        router-link#logout(:to="{name: 'logout'}") Logout
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
            $login: Object,
        },

        data() {
            return {
                user: null
            }
        },

        methods: {
            isAdmin() {
                if (this.user) {
                    return this.user.roles.indexOf("admin") !== -1;
                }
                return false;
            }
        },

        mounted() {
            this.$login.getLoggedUser().then(userData => {
                this.user = userData;
                if (this.user === null) {
                    this.$router.push({name: 'login'});
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    $bg-color: #32414d;

    section {
        padding: 1rem;

        a {
            color: white;
            text-decoration: none;

            &#logout {
                top: 5px;
                right: 5px;
                position: absolute;
            }
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
