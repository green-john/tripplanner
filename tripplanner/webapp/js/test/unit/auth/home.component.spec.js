import { shallow } from '@vue/test-utils';
import Home from 'home/home.component.vue';

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
        expect(wrapper.vm.isAdmin()).toBeFalsy();
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
        expect(wrapper.vm.isAdmin()).toBeFalsy();
    })

    test("Init with logged in admin", async () => {
        // Arrange
        const adminData = {
            username: "user",
            token: "user@admin",
            roles: ["regular", "admin"],
            id: "userId2"
        };
        $login.isUserLoggedIn.mockReturnValue(true);
        $login.queryUserInfo.mockReturnValue(Promise.resolve(adminData));

        // Act
        const wrapper = createWrapper($router, $login);

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.user).not.toBeNull();
        expect(wrapper.vm.isAdmin()).toBeTruthy();
    })
});
