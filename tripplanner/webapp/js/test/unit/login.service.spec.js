import {LoginService} from 'services/login.service';

const mockSerializer = {
    encodeCredentialsForBasicAuth: jest.fn(),
    encodeCredentialsTokenAuth: jest.fn()
};

const mockHttpService = jest.fn();

const mockCookieService = {
    set: jest.fn(),
    remove: jest.fn()
};

const REGULAR_USER = {
    username: "user",
    token: "user@regular",
    roles: ["regular"],
    id: "userId"
};

const ADMIN_USER = {
    username: "user",
    token: "user@admin",
    roles: ["regular", "admin"],
    id: "userId"
};

const MANAGER_USER = {
    username: "user",
    token: "user@manager",
    roles: ["regular", "manager"],
    id: "userId"
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Authentication', () => {
    test('Auth regular user', done => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "pass")
            .then(() => {
                // Assert
                expect(loginService.isUserLoggedIn()).toBeTruthy();
                expect(loginService.isUserManager()).toBeFalsy();
                expect(loginService.isUserAdmin()).toBeFalsy();
                expect(mockCookieService.set)
                    .toBeCalledWith('authToken', 'user@regular');

                done();
            }).catch();
    });

    test('Auth admin user', done => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: ADMIN_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "pass").then(() => {
            // Assert
            expect(loginService.isUserLoggedIn()).toBeTruthy();
            expect(loginService.isUserAdmin()).toBeTruthy();
            expect(loginService.isUserManager()).toBeFalsy();
            expect(mockCookieService.set)
                .toBeCalledWith('authToken', 'user@admin');

            done();
        }).catch();
    });

    test('Auth user manager', done => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: MANAGER_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "pass")
            .then(() => {
                // Assert
                expect(loginService.isUserLoggedIn()).toBeTruthy();
                expect(loginService.isUserManager()).toBeTruthy();
                expect(loginService.isUserAdmin()).toBeFalsy();
                expect(mockCookieService.set)
                    .toBeCalledWith('authToken', 'user@manager');

                done();
            })
            .catch();
    });

    test('Error with response', done => {
        // Arrange
        const COMPLETE_ERROR = {
            request: "something",
            response: "Error with the server"
        };
        mockHttpService.mockReturnValue(Promise.reject(COMPLETE_ERROR));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);
        // Act

        loginService.authenticate("user", "asdf")
            .then()
            .catch((error) => {
                // Assert
                expect(error).toBe(COMPLETE_ERROR);
                expect(loginService.isUserLoggedIn()).toBeFalsy();

                done();
            });
    });

    test('Error no response', done => {
        // Arrange
        const ERROR_NO_RESPONSE = {
            request: "something",
        };
        mockHttpService.mockReturnValue(Promise.reject(ERROR_NO_RESPONSE));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "asdf")
            .then()
            .catch((error) => {
                // Assert
                expect(error).toBe(ERROR_NO_RESPONSE);
                expect(loginService.isUserLoggedIn()).toBeFalsy();

                done();
            });
    });

    test('Error no request or response', done => {
        // Arrange
        const WEIRD_ERROR = {
            errrrrr: "error happened"
        };
        mockHttpService.mockReturnValue(Promise.reject(WEIRD_ERROR));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);
        // Act

        loginService.authenticate("user", "asdf")
            .then()
            .catch((error) => {
                // Assert
                expect(error).toBe(WEIRD_ERROR);
                expect(loginService.isUserLoggedIn()).toBeFalsy();

                done();
            });
    });

    test('Logout', done => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "pass")
            .then(() => {
                loginService.logout();
                // Assert
                expect(loginService.isUserLoggedIn()).toBeFalsy();
                expect(loginService.isUserManager()).toBeFalsy();
                expect(loginService.isUserAdmin()).toBeFalsy();
                expect(loginService.getUser()).toBeNull();
                expect(mockCookieService.remove).toBeCalledWith('authToken');

                done();
            })
            .catch();
    });
});

describe('GetAuthorizationHeader', () => {
    test('User not logged in', () => {
        // Arrange
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        try {
            loginService.getAuthorizationHeader();
        } catch (error) {
            // Assert
            expect(error.message).toBe("User is not logged in");
        }
    });

    test('Regular user logged in', done => {
        // Arrange
        mockSerializer.encodeCredentialsTokenAuth.mockReturnValue('Token');
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));

        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "pass")
            .then(() => {
                const authHeader = loginService.getAuthorizationHeader();

                // Assert
                expect(authHeader).toEqual({Authorization: 'Token'});
                done();
            })
            .catch();
    });
});

