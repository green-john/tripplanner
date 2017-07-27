export class SerializerService {
    encodeCredentialsForBasicAuth(username, password) {
        let userPass = username + ":" + password;
        userPass = btoa(userPass);

        return 'Custom ' + userPass;
    }

    encodeCredentialsTokenAuth(token) {
        return ' Token ' + token;
    }
}
