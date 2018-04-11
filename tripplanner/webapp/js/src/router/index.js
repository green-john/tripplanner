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

const router = new Router({
    mode: 'history',
    hashbang: false,

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
            },
            meta: {
                requiresAuth: true
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
            },
            meta: {
                requiresAuth: true
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
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const valid = await loginService.isTokenValid();
        if (!valid) {
            loginService.logout();
            next({
                path: "/login",
                query: { redirect: to.fullPath }
            });
            return;
        }
    }
    next();
});

export default router;