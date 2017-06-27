import { LoginService } from 'login/login.service';
import { DialogController } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

export class LoginController {
    static inject() {
        return [LoginService, DialogController, Router];
    }

    constructor(loginService, dialogController, router) {
        this.EMPTY_USERNAME_ERROR = 'Username must be non-empty';
        this.EMPTY_PASSWORD_ERROR = 'Password must be non-empty';

        this.username = '';
        this.password = '';
        this.errors = [];

        this.$login = loginService;
        this.router = router;
        this.dialogCtrl = dialogController;
    }

    login() {
        let localErrors = this._validateForm();
        if (localErrors.length > 0) {
            this.errors = localErrors;
            return;
        }

        this.$login.authenticate(this.username, this.password)
            .then((userInfo) => {
                this.dialogCtrl.ok(userInfo);
                this.router.navigate('home');
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