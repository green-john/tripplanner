import Vue from 'vue';
import LoginComponent from 'components/Login';

const loginMock = {
    authenticate: jest.fn()
};

describe("Login Controller", () => {
    test('Login', done => {
        // Arrange
        loginMock.authenticate.mockReturnValue(Promise.resolve({data: "user data"}));
        const Ctor = Vue.extend(LoginComponent);
        Ctor.prototype.$router = {
            push: jest.fn()
        };
        const loginCtrl = new Ctor({
            propsData: {
                $login: loginMock
            }
        }).$mount();
        loginCtrl.username = "user";
        loginCtrl.password = "pass";

        // Act
        Vue.nextTick(() => {
            loginCtrl.login()
                .then(() => {
                    // Assert
                    expect(loginCtrl.$router.push).toBeCalledWith({name: "home"});
                    done();
                })
                .catch(error => {
                    console.log(error);
                });

        });
    });
});