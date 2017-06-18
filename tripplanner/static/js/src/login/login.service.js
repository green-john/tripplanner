import { SerializerService } from 'utils/serializer.service';

export class LoginService {
    constructor(serializerService, httpService) {
        this.$serializer = serializerService;
        this.$http = httpService;
        this.userLoggedIn = false;
        this.userInfo = null;
    }

    static inject() {
        return [SerializerService, 'axios']
    }

    authenticate(username, password) {
        let authHeader = this.$serializer
            .encodeCredentialsForBasicAuth(username, password);

        return this.$http.post('/token/', {
            headers: {
                'Authorization': authHeader
            }
        }).then(response => {
            this.userInfo = response.data;
            this.userLoggedIn = true;
            return this.userInfo;
        }).catch(error => {
            this._handleErrors(error);
        });
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
