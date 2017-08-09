<template>
    <div class="col-xs-offset-3">

        <div v-if="user">
            <p>Welcome {{user.username}}. Here you can manage your things:</p>
        </div>

        <ul>
            <li v-if="isAdmin()"><router-link :to="{name: 'users'}">Manage Users</router-link></li>
            <li><router-link :to="{name: 'trips'}">Manage Trips</router-link></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HomeController',

        props: {
            $login: Object,
        },

        data() {
            return {
                roles: [],
                user: this.$login.getUser()
            }
        },

        methods: {
            isAdmin() {
                return this.roles.indexOf('admin') !== -1;
            },

            isManager() {
                return this.roles.indexOf('manager') !== -1;
            }
        },

        created() {
            console.log(this.$login.getUser());
            if (!this.user) {
                this.$router.push({name: 'login'});
            }
        }
    }
</script>
