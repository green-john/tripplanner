import Vue from 'vue';
import Router from 'vue-router';
import Axios from 'axios';
import Cookie from 'js-cookie';

import Login from 'components/Login';
import Home from 'components/Home';
import {LoginService} from 'services/login.service';
import {SerializerService} from 'services/serializer.service';

Vue.use(Router);

const httpService = Axios.create();
const serializerService = new SerializerService();
const loginService = new LoginService(httpService, Cookie, serializerService);

const routerConfig = {
    mode: 'history',

    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            props: {
                $login: loginService
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            props: {
                $login: loginService
            }
        },
    ],
};

export default new Router(routerConfig);