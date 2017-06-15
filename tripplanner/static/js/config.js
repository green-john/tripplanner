
export class Router {
    configureRouter(config, router) {
        this.router = router;
        config.title = "Trip Planner";

        config.map([
            {route: ['', '/home'], moduleId: 'home', title: 'Home', nav: true},
            {route: '/login', moduleId: 'login/login', title: 'Login', name: 'login'},
            {route: '/users', moduleId: 'users/users', title: 'Users', name: 'users'},
            {route: '/trips', moduleId: 'trips/trips', title: 'Trips', name: 'trips'},
        ])
    }
}