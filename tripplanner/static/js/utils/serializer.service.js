"use strict";

export class SerializerService {
    encodeCredentialsForBasicAuth(username, password) {
        let userPass = username + ":" + password;
        userPass = btoa(userPass);

        return 'Basic ' + userPass;
    }

    encodeCredentialsTokenAuth(token) {
        return ' Token ' + token;
    }
}
