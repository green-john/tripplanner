<template>
    <div>
        <h2>Log In compadre!</h2>
        <form @submit.prevent="login">
            <div class="col-xs-offset-3 col-xs-6">
                <div class="row">
                    <input v-model="username" placeholder="username">
                </div>
                <div class="row">
                    <input type="password" v-model="password" placeholder="password">
                </div>
                <div class="row">
                    <div class="individualError" v-for="error in errors">
                        {{error}}
                    </div>
                </div>
                <div class="row">
                    <button @click.prevent="login">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {LoginService} from 'services/login.service';

    export default {
        name: 'login',

        props: {
            $login: Object
        },

        data() {
            return {
                // Constants
                EMPTY_USERNAME_ERROR: 'Username must be non-empty',
                EMPTY_PASSWORD_ERROR: 'Password must be non-empty',
                // Data
                username: '',
                password: '',
                // Errors
                errors: [],
            };
        },

        methods: {
            login() {
                const localErrors = this._validateForm();
                this.errors = localErrors;
                if (localErrors.length > 0) {
                    throw new Error(localErrors);
                }

                return this.$login.authenticate(this.username, this.password)
                    .then(userInfo => {
                        this.$router.push({name:'home'})
                    })
                    .catch(error => {
                        console.log(error);
                        this.errors = [error.response.data];
                        throw error;
                    })
            },

            _validateForm() {
                let localErrors = [];
                if (!this.username) {
                    localErrors.push(this.EMPTY_USERNAME_ERROR);
                }

                if (!this.password) {
                    localErrors.push(this.EMPTY_PASSWORD_ERROR);
                }

                return localErrors;
            },
        }
    }
</script>