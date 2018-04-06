
export class LoginService {
    constructor(httpService, storageService, serializerService) {
        this.TOKEN_KEY = 'authToken';

        this.$http = httpService;
        this.$serializer = serializerService;
        this.$storage = storageService;
        this.userInfo = null;
    }

    isUserLoggedIn() {
        const token = this.getToken();
        return token !== null;
    }

    getToken() {
        return this.$storage.getItem(this.TOKEN_KEY);
    }

    queryUserInfo() {
        return this.$http({
            url: '/get_info/',
            method: 'post',
            headers: {
                'Authorization': this.getAuthorizationHeader()
            },
        }).then(response => {
            this.cacheUser(response.data);
            return response.data;
        }).catch(response => {
            this._handleErrors(response);
            throw response;
        });
    }

    authenticate(username, password) {
        return this.$http({
            url: '/token',
            method: 'post',
            auth: {username, password},
        }).then(response => {
            this.cacheUser(response.data);
            return response.data;
        }).catch(error => {
            this._handleErrors(error);
            throw error;
        });
    }

    cacheUser(userData) {
        this.userInfo = userData;
        this.$storage.setItem(this.TOKEN_KEY, userData.token);
    }

    logout() {
        this.$storage.removeItem('authToken');
        this.userInfo = null;
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

        return this.$serializer.encodeCredentialsTokenAuth(this.getToken());
    }

    _handleErrors(error) {
        this.userLoggedIn = false;
        this.userInfo = null;
        console.log(error);

        if (error.response) {
            // Request made server responded with something other
            // than 2xx
            console.log("Response", error.response);
        } else if (error.request) {
            // No response received
            console.log('Request:', error.request);
        } else {
            // Weird shit happened
            console.log(error);
        }
    }
}
