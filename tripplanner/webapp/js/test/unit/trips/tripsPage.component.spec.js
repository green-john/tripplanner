import { shallow } from "@vue/test-utils";
import { tripData } from "./data";
import TripsPage from "trips/tripsPage.component";

const $trips = {
    getAllTrips: jest.fn()
};

describe("Trips Page", () => {
    test("Show create", async () => {
        // Arrange
        const wrapper = shallow(TripsPage, {
            stubs: ['trip-list', 'create-trip', 'trip-filter', 'upcoming-trips'],
            propsData: { $trips }
        });

        // Act
        wrapper.find('button.add').trigger('click');

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showCreate).toBeTruthy();
    });
});