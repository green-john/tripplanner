import { LoginService } from 'login/login.service';

export class LoginController {
    constructor(loginService) {
        this.EMPTY_USERNAME_ERROR = 'Username must be non-empty';
        this.EMPTY_PASSWORD_ERROR = 'Password must be non-empty';

        this.username = '';
        this.password = '';
        this.errors = [];

        this.$login = loginService;
    }

    static inject() {
        return [LoginService]
    }

    login() {
        let localErrors = this._validateForm();
        if (localErrors.length > 0) {
            this.errors = localErrors;
            return;
        }

        this.$login.authenticate(this.username, this.password)
            .then((user) => {
                // Redirect to home
            })
            .catch((error) => {
                console.log(error);
            });


    }

    _validateForm() {
        let localErrors = [];
        if (!this.username) {
            localErrors.push(this.EMPTY_USERNAME_ERROR);
        }

        if (!this.password) {
            localErrors.push(this.EMPTY_PASSWORD_ERROR);
        }

        return localErrors;
    }
}