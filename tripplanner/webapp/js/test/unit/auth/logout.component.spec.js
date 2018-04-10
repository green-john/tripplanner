import { shallow } from "@vue/test-utils";
import Logout from "auth/Logout";

const $login = {
    logout: jest.fn()
};

const $router = {
    push: jest.fn()
};

describe("Logout", () => {
    test("User logs successfully", () => {
        // Arrange
        // Act
        const wrapper = shallow(Logout, {
            mocks: { $router },
            propsData: { $login }
        });

        // Assert
        expect($login.logout).toBeCalled();
        expect($router.push).toBeCalledWith({name: 'home'});
    });
});