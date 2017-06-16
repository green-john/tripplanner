
export class Router {
    configureRouter(config, router) {

        this.router = router;
        config.title = "Trip Planner";

        config.map([
            {route: ['', '/home'], moduleId: 'static/js/home/home', title: 'Home', nav: true},
            {route: '/login', moduleId: 'static/js/login/login', title: 'Login', name: 'login'},
            {route: '/users', moduleId: 'static/js/users/users', title: 'Users', name: 'users'},
            {route: '/trips', moduleId: 'static/js/trips/trips', title: 'Trips', name: 'trips'},
        ]);

        console.log("done");
    }
}