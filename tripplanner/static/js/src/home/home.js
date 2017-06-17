import { LoginService } from 'login/login.service';


export class HomeController {
    constructor(loginService) {
        this.$login = loginService;
        this.user = this.$login.getUser();
        this.isRegular = true;
        this.isAdmin = this.$login.isUserAdmin();
        this.isManager = this.$login.isUserManager();

        console.log('In home ctrls');
    }

    static inject() {
        return [LoginService];
    }
}
