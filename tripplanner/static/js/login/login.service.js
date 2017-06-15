import { SerializerService } from '../utils/serializer.service';

import { inject } from 'aurelia-framework';

@inject(SerializerService, 'axios')
export class LoginService {
    constructor(serializer, httpClient) {
        this.serializer = serializer;
        this.http = httpClient;
        this.userLoggedIn = false;
        this.userInfo = null;
    }

    authenticate(username, password) {
        let authHeader = this.serializer
            .encodeCredentialsForBasicAuth(username, password);

        return this.http.post('/token/', {
            headers: {
                'Authorization': authHeader
            }
        }).then(response => {
            this.userInfo = response.userInfo;
            this.userLoggedIn = true;
            return response.data;
        }).catch(error => {
            // alert(error);
            console.log(error);
        })
    }
}
