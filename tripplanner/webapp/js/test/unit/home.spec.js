import { shallow } from '@vue/test-utils';
import Home from 'home/Home.vue';

const $login = {
    getLoggedUser() {
        return Promise.resolve(null);
    },
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
    test("Mounted with no logged user", done => {
        // Arrange
        // Act
        const wrapper = createWrapper($router, $login);
        // Assert
        wrapper.vm.$nextTick(() => {
            expect($router.push).toBeCalledWith({name: "login"});
            done();
        });
    });
});
