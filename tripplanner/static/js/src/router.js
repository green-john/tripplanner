import { PLATFORM } from 'aurelia-framework';

export class Router {
    configureRouter(config, router) {
        this.router = router;
        config.title = "Trip Planner";
        config.options.pushState = true;
        config.options.root = '/';

        config.map([
            {route: '', moduleId: PLATFORM.moduleName('index'), title: 'Index', nav: true},
            {route: 'home', moduleId: PLATFORM.moduleName('home/home'),  title: 'Login', name: 'login'},
            {route: 'login', moduleId: PLATFORM.moduleName('login/login'), title: 'Login', name: 'login'},
            {route: 'users', moduleId: ('users/users'), title: 'Users', name: 'users'},
            {route: 'trips', moduleId: ('trips/trips'), title: 'Trips', name: 'trips'},
        ]);

        console.log("done");
    }
}