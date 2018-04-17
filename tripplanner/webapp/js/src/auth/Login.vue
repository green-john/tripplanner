<template lang="pug">
    section
        form(@submit.prevent="loginUser")
            h2 Welcome back!
            p.error(v-for="error in errors") {{error}}
            div.input-field
                span.fas.fa-user
                input#username(v-model="username" placeholder="username")
            div.input-field
                span.fas.fa-lock
                input#password(type="password" v-model="password" placeholder="password")

            button(@click.prevent="loginUser") Log in
</template>

<script>
    export default {
        name: 'login-component',

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
            loginUser() {
                const localErrors = this._validateForm();
                this.errors = localErrors;
                if (localErrors.length > 0) {
                    throw new Error(localErrors);
                }

                return this.$login.authenticate(this.username, this.password)
                    .then(userInfo => {
                        this.$router.push({name: 'home'});
                        return userInfo;
                    })
                    .catch(error => {
                        this.errors = [error.response.statusText];
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
        },

        mounted() {
            if (this.$login.isUserLoggedIn()) {
                this.$router.push({name: 'home'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~style/globals";

    section {
        text-align: center;

        form {
            background-color: $white;
            border-radius: .3rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            color: $color2;
            display: inline-block;
            padding: 1.2rem;
            margin-top: 2rem;
            text-align: left;

            h2 {
                margin-bottom: .5rem;
            }

            div.input-field {
                margin-top: 1rem;
                position: relative;

                span {
                    align-content: center;
                    border-right: 1px solid $gray-border;
                    background: none;
                    display: grid;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    position: absolute;
                    padding: .8rem;
                }

                input {
                    border: 2px solid $gray-border;
                    border-radius: .3rem;
                    box-shadow: inset 0 1px 2px $gray-border;
                    font-size: 1rem;
                    height: 3rem;
                    outline: none;
                    padding-left: 3rem;
                    width: 17rem;
                    transition: border .2s linear;

                    &:focus {
                        border: 1px solid $color1;
                    }
                }
            }

            p.error {
                background-color: $blood-color;
                border-radius: .2rem;
                color: $white;
                font-size: .9rem;
                margin-top: .3rem;
                padding: .3rem;
                text-align: center;
            }

            button {
                font-size: 1rem;
                height: 3rem;
                margin-top: 1rem;
                width: 17rem;
            }
        }
    }

</style>