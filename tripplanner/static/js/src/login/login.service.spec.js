import { LoginService } from 'login/login.service';

class MockSerializer {
    encodeCredentialsForBasicAuth(username, pass) {
        return `${username}#${pass}`;
    }
}

class MockHttpService {
    post(url, params) {
        return new Promise((resolve, reject) => {
            resolve({
                data: "user Info",
            });
        })
    }
}

describe('Authentication positive cases', () => {
    test('Simple case', () => {
        // Arrange
        let loginService = new LoginService(new MockSerializer(),
            new MockHttpService());

        // Act
        loginService.authenticate("user", "pass").then(() => {
            // Assert
            expect(loginService.isUserLoggedIn()).toBeTruthy();
        });
    });

    test('')
});

