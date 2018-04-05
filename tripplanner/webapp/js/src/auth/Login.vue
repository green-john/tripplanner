<template lang="pug">
    section
        form(@submit.prevent="loginUser")
            h2 Welcome back!
            div.input-field
                span.fas.fa-user
                input#username(v-model="username" placeholder="username")
            div.input-field
                span.fas.fa-lock
                input#password(type="password" v-model="password" placeholder="password")

            p.individualError(v-for="error in errors") {{error}}
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
                        this.errors = [error.response.data];
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

    $gray-border: rgba(203,203,210,0.4);
    $bg-color: #32414d;
    $bg-color2: rgba(50, 65, 77, 0.91);

    section {
        /*box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);*/
        text-align: center;
        /*width: 80%;*/

        form {
            background-color: #fff;
            border-radius: .3rem;
            color: $bg-color;
            display: inline-block;
            padding: 1rem;
            margin-top: 2rem;


            h2 {
                margin-bottom: .5rem;
            }

            div.input-field {
                margin: 1rem 0;
                position: relative;

                span {
                    align-content: center;
                    border-right: 1px solid $gray-border;
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
                        border: 1px solid $bg-color;
                    }
                }
            }

            button {
                background: linear-gradient(to right, $bg-color, $bg-color2);
                border-radius: .3rem;
                color: white;
                font-size: 1rem;
                height: 3rem;
                width: 17rem;
            }
        }
    }

</style>