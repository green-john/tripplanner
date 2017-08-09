import Vue from 'vue';
import Router from 'vue-router';
import Axios from 'axios';
import Cookie from 'js-cookie';

import Login from 'components/Login';
import Logout from 'components/Logout';
import Trips from 'components/Trips';
import Home from 'components/Home';
import {LoginService} from 'services/login.service';
import {SerializerService} from 'services/serializer.service';
import {TripService} from "../services/trips.service";

Vue.use(Router);

const httpService = Axios.create();
const serializerService = new SerializerService();
const loginService = new LoginService(httpService, Cookie, serializerService);
const tripService = new TripService(httpService, loginService);

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
                $login: loginService,
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