import { shallow } from '@vue/test-utils';
import Home from 'home/home.component.vue';



const $login = {
    userInfo: {
        username: "user",
        token: "user@admin",
        roles: ["regular", "admin"],
        id: "userId2"
    },
    isUserAdmin: jest.fn()
};

function createWrapper($login) {
    return shallow(Home, {
        stubs: ['router-link'],
        propsData: {$login}
    });
}

describe("Home component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Init with logged in admin", async () => {
        // Arrange
        $login.isUserAdmin.mockReturnValue(true);

        // Act
        const wrapper = createWrapper($login);

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.user).not.toBeNull();
        expect(wrapper.vm.isAdmin()).toBeTruthy();
    })
});
