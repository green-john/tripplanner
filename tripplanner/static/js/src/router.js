import { PLATFORM } from 'aurelia-framework';
import { LoginService } from 'login/login.service'
import { Redirect, Router } from 'aurelia-router';

export class RouterConfig {
    static inject() {
        return [LoginService, AuthorizeStep];
    }

    constructor(loginService, authStep) {
        this.$login = loginService;
        this.authorizeStep = authStep;
    }

    configureRouter(config, router) {
        this.router = router;
        config.title = "Trip Planner";
        config.options.pushState = true;
        config.options.root = '/';

        config.addAuthorizeStep(this.authorizeStep);
        console.log(config);
        console.log(this.authorizeStep);

        config.map([
            {route: '', moduleId: PLATFORM.moduleName('index'), title: 'Index', name: 'index', nav: true},
            {route: 'home', moduleId: PLATFORM.moduleName('home/home'), title: 'Home',
                name: 'home', settings: {auth: true}},
            {route: 'trips', moduleId: ('trips/trips'), title: 'Trips', name: 'trips',
                settings: {auth: true}},
            {route: 'users', moduleId: ('users/users'), title: 'Users', name: 'users'},
        ]);
    }

    logout() {
        console.log('Logging out....');
        this.$login.logout();
        this.router.navigate('index');
    }
}

class AuthorizeStep {
    static inject() {
        return [LoginService, Router]
    }

    constructor(loginService, router) {
        this.$login = loginService;
        this.router = router;
    }

    run(navigationInstruction, next) {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
            if (!this.$login.isUserLoggedIn()) {
                return next.cancel(new Redirect(this._getUrlGivenName('index')));
            }
        }

        return next();
    }

    _getUrlGivenName(routeName) {
        return this.router.generate(routeName);
    }
}