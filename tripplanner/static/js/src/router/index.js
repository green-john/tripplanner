import Vue from 'vue';
import Router from 'vue-router';
import Login from 'components/login';
import Home from 'components/home';

import {LoginService} from 'services/login.service';
import {SerializerService} from 'services/serializer.service';
import Axios from 'axios';

Vue.use(Router);

const routerConfig = {
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            props: {
                $login: new LoginService(Axios.create(), new SerializerService())
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
        },
    ],
};

export default new Router(routerConfig);