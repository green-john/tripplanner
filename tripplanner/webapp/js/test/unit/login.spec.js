import { shallow } from '@vue/test-utils';
import LoginComponent from 'auth/Login.vue';

const $login = {
    authenticate: jest.fn(),
    isUserLoggedIn: jest.fn()
};

const $router = {
    push: jest.fn()
};

const userData = {username: "user", password: "pass"};

function createWrapper($router, $login, data) {
    return shallow(LoginComponent, {
        mocks: {$router},
        propsData: {$login},
        data: data
    });
}


describe("Login Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("On load", () => {
        test("User logged in", () => {
            // Arrange
            $login.authenticate.mockReturnValue(
                Promise.resolve({data: "user data"}));
            $login.isUserLoggedIn.mockReturnValue(true);

            // Act
            createWrapper($router, $login, userData);

            // Assert
            expect($router.push).toBeCalledWith({name: "home"});
        });
    });

    describe("LoginUser", () => {
        test('Login successful', done => {
            // Arrange
            $login.authenticate.mockReturnValue(
                Promise.resolve({data: "user data"}));
            const wrapper = createWrapper($router, $login, userData);

            // Act
            wrapper.find('button').trigger('click');

            // Assert
            wrapper.vm.$nextTick(() => {
                expect($router.push).toBeCalledWith({name: "home"});
                done();
            });
        });

        test('Not enough data', () => {
            // Arrange
            $login.authenticate.mockReturnValue(
                Promise.resolve({data: "user data"}));
            const wrapper = createWrapper($router, $login, {});

            // Act
            wrapper.find('button').trigger('click');

            // Assert
            expect(wrapper.vm.errors).toHaveLength(2);
        });

        test('Auth failed', async () => {
            // Arrange
            $login.authenticate.mockReturnValue(
                Promise.reject({response: {data: "Niet spaciba"}}));
            const wrapper = createWrapper($router, $login,
                {username:"asdf", password:"pass"});

            // Act
            wrapper.find('button').trigger('click');

            // Assert
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.errors).toHaveLength(1);
        })
    })
});