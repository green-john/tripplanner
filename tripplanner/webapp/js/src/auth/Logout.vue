<template>

</template>

<script>
    export default {
        name: 'logout',

        props: {
            $login: Object
        },

        created() {
            console.log(this.$login.getUser());
            this.$login.logout();
            this.$router.push({name: 'home'});
        }
    }

</script>