import { inject } from 'aurelia-framework';

import { LoginService } from 'login/login.service';

@inject(LoginService)
export class Home {
    constructor(loginService) {
        this.loginService = loginService;
        this.user = this.loginService.getUser();
        this.isRegular = true;
        this.isAdmin = this.loginService.isUserAdmin();
        this.isManager = this.loginService.isUserManager();
    }
}
