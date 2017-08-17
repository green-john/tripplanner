
export class LoginService {
    constructor(httpService, cookieService, serializerService) {
        this.$http = httpService;
        this.$serializer = serializerService;
        this.$cookie = cookieService;
        this.userLoggedIn = false;
        this.userInfo = null;
    }

    // getToken() {
    //     return this.$cookie.get('authToken');
    // }

    // getUserGivenToken(token) {
    //     return this.$http({
    //         url: '/user_info',
    //         method: 'post',
    //         data: {
    //             'token': token
    //         },
    //         headers: {
    //             'Authorization': this.getAuthorizationHeader()
    //         },
    //     }).then(response => {
    //         this.saveUser(response.data);
    //     }).catch(error => {
    //         this._handleErrors(error);
    //         throw error;
    //     });
    // }

    authenticate(username, password) {
        return this.$http({
            url: '/token',
            method: 'post',
            auth: {username, password},
        }).then(response => {
            return this.saveUser(response.data);
        }).catch(error => {
            this._handleErrors(error);
            throw error;
        });
    }

    saveUser(userData) {
        this.userInfo = userData;
        this.$cookie.set('authToken', userData.token);
        this.userLoggedIn = true;
        return this.userInfo;
    }

    logout() {
        this.$cookie.remove('authToken');
        this.userInfo = null;
        this.userLoggedIn = false;
    }

    isUserLoggedIn() {
        return (this.userLoggedIn && this.userInfo);
    }

    isUserManager() {
        if (!this.isUserLoggedIn()) {
            return false;
        }

        return this.userInfo.roles.indexOf('manager') !== -1;
    }

    isUserAdmin() {
        if (!this.isUserLoggedIn()) {
            return false;
        }

        return this.userInfo.roles.indexOf('admin') !== -1;
    }

    getAuthorizationHeader() {
        if (!this.isUserLoggedIn()) {
            throw Error("User is not logged in");
        }

        return this.$serializer.encodeCredentialsTokenAuth(this.userInfo.token);
    }

    getUser() {
        return this.userInfo;
    }

    _handleErrors(error) {
        this.userLoggedIn = false;
        this.userInfo = null;
        console.log(error);

        if (error.response) {
            // Request made server responded with something other
            // than 2xx
            console.log('Response:');
            console.log(error.response);
        } else if (error.request) {
            // No response received
            console.log('Request:');
            console.log(error.request);
        } else {
            // Weird shit happened
            console.log(error);
        }
        console.log(error.config);

        throw error;
    }
}
