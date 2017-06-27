import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { LoginController } from 'login/login';

export class IndexController {
    static inject() {
        return [DialogService, Router];
    }

    constructor(dialogService, router) {
        this.user = null;
        this.$dialog = dialogService;
        this.router = router;
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