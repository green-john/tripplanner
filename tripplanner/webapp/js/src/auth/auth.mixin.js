
export default {
    props: {
        $login: Object
    },

    data() {
        return {
            user: null
        }
    },

    mounted() {
        if (this.$login.isUserLoggedIn()) {
            this.$login.queryUserInfo().then(userData => {
                this.user = userData;
            }).catch(error => {
                console.log(error);
                this.$login.logout();
                this.$router.push({name: 'login'});
            });
        } else {
            this.$router.push({name: 'login'});
        }
    }
}