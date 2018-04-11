import {LoginService} from 'auth/login.service';

const mockSerializer = {
    encodeCredentialsForBasicAuth: jest.fn(),
    encodeCredentialsTokenAuth: jest.fn()
};

const mockHttpService = jest.fn();

const mockCookieService = {
    items: new Map(),

    getItem(key) {
        if (this.items.has(key)) {
            return this.items.get(key);
        }
        return null;
    },

    setItem(key, value) {
        this.items.set(key, value);
    },

    removeItem(key) {
        this.items.delete(key);
    }
};

const REGULAR_USER = {
    username: "user",
    token: "user@regular",
    roles: ["regular"],
    id: "userId1"
};

const ADMIN_USER = {
    username: "user",
    token: "user@admin",
    roles: ["regular", "admin"],
    id: "userId2"
};

const MANAGER_USER = {
    username: "user",
    token: "user@manager",
    roles: ["regular", "manager"],
    id: "userId3"
};

beforeEach(() => {
    jest.clearAllMocks();
    mockCookieService.items = new Map();
});

describe('Authentication', () => {
    test ('Auth regular user', async () => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        const userData = await loginService.authenticate("user", "pass");
            // Assert
        expect(loginService.isUserLoggedIn()).toBeTruthy();
        expect(loginService.isUserManager()).toBeFalsy();
        expect(loginService.isUserAdmin()).toBeFalsy();
        expect(mockCookieService.getItem("authToken")).toBe('user@regular');
        expect(loginService.getUserId()).toBe("userId1");
        expect(await loginService.isTokenValid()).toBeTruthy();
        expect(await loginService.queryUserInfo()).toEqual(userData);
    });

    test('Auth admin user', async () => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: ADMIN_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        const userData = await loginService.authenticate("user", "pass");
            // Assert
        expect(loginService.isUserLoggedIn()).toBeTruthy();
        expect(loginService.isUserAdmin()).toBeTruthy();
        expect(loginService.isUserManager()).toBeFalsy();
        expect(mockCookieService.getItem("authToken")).toBe('user@admin');
        expect(loginService.getUserId()).toBe("userId2");
        expect(await loginService.isTokenValid()).toBeTruthy();
        expect(await loginService.queryUserInfo()).toEqual(userData);
    });

    test('Auth user manager', async () => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: MANAGER_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        const userData = await loginService.authenticate("user", "pass");
            // Assert
        expect(loginService.isUserLoggedIn()).toBeTruthy();
        expect(loginService.isUserManager()).toBeTruthy();
        expect(loginService.isUserAdmin()).toBeFalsy();
        expect(mockCookieService.getItem("authToken")).toBe('user@manager');
        expect(await loginService.isTokenValid()).toBeTruthy();
        expect(await loginService.queryUserInfo()).toEqual(userData);
    });

    test('Error with response', () => {
        // Arrange
        expect.assertions(2);

        const COMPLETE_ERROR = {
            request: "something",
            response: "Error with the server"
        };
        mockHttpService.mockReturnValue(Promise.reject(COMPLETE_ERROR));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        return loginService.authenticate("user", "asdf").catch(error => {
            // Assert
            expect(error).toBe(COMPLETE_ERROR);
            expect(loginService.isUserLoggedIn()).toBeFalsy();
        });
    });

    test('Error with request', () => {
        // Arrange
        expect.assertions(2);

        const ERROR_NO_RESPONSE = {
            request: "something",
        };
        mockHttpService.mockReturnValue(Promise.reject(ERROR_NO_RESPONSE));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        loginService.authenticate("user", "asdf").catch((error) => {
            // Assert
            expect(error).toBe(ERROR_NO_RESPONSE);
            expect(loginService.isUserLoggedIn()).toBeFalsy();
        });
    });

    test('Logout', () => {
        // Arrange
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));
        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        return loginService.authenticate("user", "pass").then(() => {
            loginService.logout();
            // Assert
            expect(loginService.isUserLoggedIn()).toBeFalsy();
            expect(loginService.isUserManager()).toBeFalsy();
            expect(loginService.isUserAdmin()).toBeFalsy();
            expect(mockCookieService.getItem('authToken')).toBeNull();
            expect(() => loginService.getAuthorizationHeader()).toThrow();
        });
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

    test('Regular user logged in', () => {
        // Arrange
        mockSerializer.encodeCredentialsTokenAuth.mockReturnValue('Token');
        mockHttpService.mockReturnValue(Promise.resolve({data: REGULAR_USER}));

        const loginService = new LoginService(mockHttpService, mockCookieService, mockSerializer);

        // Act
        return loginService.authenticate("user", "pass").then(() => {
            const authHeader = loginService.getAuthorizationHeader();

            // Assert
            expect(authHeader).toEqual('Token');
        });
    });
});

