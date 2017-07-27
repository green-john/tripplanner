
export class LoginService {
    constructor(httpService, cookieService, serializerService) {
        this.$http = httpService;
        this.$serializer = serializerService;
        this.$cookie = cookieService;
        this.userLoggedIn = false;
        this.userInfo = null;
    }

    authenticate(username, password) {
        return this.$http({
            url: '/token',
            method: 'post',
            auth: {username, password},
        }).then(response => {
            this.userInfo = response.data;
            this.$cookie.set('authToken', response.data.token);
            this.userLoggedIn = true;
            return this.userInfo;
        }).catch(error => {
            this._handleErrors(error);
            throw error;
        });
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

        const user = this.userInfo;
        const authHeader = this.$serializer.encodeCredentialsTokenAuth(user.token);

        return {
            'Authorization': authHeader
        };
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
