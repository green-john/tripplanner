<template>

</template>

<script>
    export default {
        name: 'logout',

        props: {
            $login: Object
        },

        created() {
            this.$login.logout();
            this.$router.push({name: 'home'});
        }
    }

</script>