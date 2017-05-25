
export class LoginController {
    constructor() {
        this.EMPTY_USERNAME_ERROR = 'Username must be non-empty';
        this.EMPTY_PASSWORD_ERROR = 'Password must be non-empty';

        this.username = '';
        this.password = '';
        this.errors = [];
    }

    login() {
        let localErrors = this._validateForm();
        if (localErrors.length > 0) {
            this.errors = localErrors;
        } else {

        }
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