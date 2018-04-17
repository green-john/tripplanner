
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
            url: '/api/v1/get_info/',
            method: 'post',
            headers: {
                'Authorization': this.getAuthorizationHeader()
            },
        }).then(response => {
            this.cacheUser(response.data);
            return response.data;
        }).catch(error => {
            this._clearUser(error);
            throw error;
        });
    }

    authenticate(username, password) {
        return this.$http({
            url: '/api/v1/token',
            method: 'post',
            auth: {username, password},
        }).then(response => {
            this.cacheUser(response.data);
            return response.data;
        }).catch(error => {
            this._clearUser(error);
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

    getUserId() {
        if (!this.isUserLoggedIn()) {
            throw "Users is not logged in";
        }
        return this.userInfo["id"];
    }

    isTokenValid() {
        if (this.isUserLoggedIn()) {
            return this.queryUserInfo().then(() => {
                return true;
            }).catch(() => {
                return false;
            })
        }
        return Promise.resolve(false);
    }

    _clearUser() {
        this.userLoggedIn = false;
        this.userInfo = null;
    }
}
