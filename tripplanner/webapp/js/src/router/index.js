import Vue from 'vue';
import Router from 'vue-router';
import Axios from 'axios';

import Login from 'auth/Login.vue';
import Logout from 'auth/Logout.vue';
import Trips from 'trips/tripsPage.component.vue';
import Home from 'home/home.component.vue';
import {LoginService} from 'auth/login.service';
import {SerializerUtil} from 'utils/serializer';
import {TripService} from "../trips/trips.service";

const httpService = Axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

const serializerService = new SerializerUtil();
const loginService = new LoginService(httpService, window.localStorage, serializerService);
const tripService = new TripService(httpService, loginService);

Vue.use(Router);

const routerConfig = {
    mode: 'history',

    routes: [
        {
            path: '',
            redirect: {name: 'home'}
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            props: {
                $login: loginService
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            props: {
                $login: loginService
            }
        },
        {
            path: '/trips',
            name: 'trips',
            component: Trips,
            props: {
                $trips: tripService
            }
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout,
            props: {
                $login: loginService
            }
        }
    ],
};

export default new Router(routerConfig);