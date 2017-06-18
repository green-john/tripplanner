import { LoginService } from 'login/login.service';
import { DialogController } from 'aurelia-dialog';

export class LoginController {
    static inject() {
        return [LoginService, DialogController];
    }

    constructor(loginService, dialogController) {
        this.EMPTY_USERNAME_ERROR = 'Username must be non-empty';
        this.EMPTY_PASSWORD_ERROR = 'Password must be non-empty';

        this.username = '';
        this.password = '';
        this.errors = [];

        this.$login = loginService;
        this.dialogCtrl = dialogController;
    }

    login() {
        let localErrors = this._validateForm();
        if (localErrors.length > 0) {
            this.errors = localErrors;
            return;
        }

        this.$login.authenticate(this.username, this.password)
            .then((user) => {
                this.dialogCtrl.ok(user);
                // Redirect to home
            })
            .catch((error) => {
                this.errors = [error];
                this.dialogCtrl.ok(null);
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