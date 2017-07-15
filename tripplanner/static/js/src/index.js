import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { LoginController } from 'login/login';
import { LoginService } from 'login/login.service';

export class IndexController {
    static inject() {
        return [DialogService, Router, LoginService];
    }

    constructor(dialogService, router, loginService) {
        this.user = null;
        this.$dialog = dialogService;
        this.$login = loginService;
        this.router = router;
    }

    attached() {
        console.log(this.$login.isUserLoggedIn());
        if (this.$login.isUserLoggedIn()) {
            this.router.navigate('home');
        }
    }

    showLoginDialog() {
        this.$dialog.open({viewModel: LoginController, lock: true})
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    console.log(response);
                    if (response.output) {
                        this.user = response.output;
                        this.router.navigate('home');
                    } else {
                        console.log("Could not login")
                    }
                }
            });
    }
}