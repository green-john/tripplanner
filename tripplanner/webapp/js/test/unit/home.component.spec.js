import { shallow } from '@vue/test-utils';
import Home from 'home/Home.vue';

const $login = {
    isUserLoggedIn: jest.fn(),
    queryUserInfo: jest.fn(),
    logout: jest.fn()
};

const $router = {
    push: jest.fn()
};

function createWrapper($router, $login) {
    return shallow(Home, {
        mocks: {$router},
        stubs: ['router-link'],
        propsData: {$login}
    });
}

describe("Home component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Init with no logged user", async () => {
        // Arrange
        $login.isUserLoggedIn.mockReturnValue(false);
        // Act
        const wrapper = createWrapper($router, $login);
        // Assert
        await wrapper.vm.$nextTick();
        expect($router.push).toBeCalledWith({name: "login"});
    });

    test("Init with expired token", async () => {
        // Arrange
        $login.isUserLoggedIn.mockReturnValue(true);
        $login.queryUserInfo.mockReturnValue(Promise.reject("Error"));
        // Act
        const wrapper = createWrapper($router, $login);
        // Assert
        await wrapper.vm.$nextTick();
        expect($router.push).toBeCalledWith({name: "login"});
        expect($login.logout).toBeCalled();
    })
});
