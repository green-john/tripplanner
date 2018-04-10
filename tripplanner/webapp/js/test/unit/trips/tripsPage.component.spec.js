import { shallow } from "@vue/test-utils";
import { tripData } from "./data";
import TripsPage from "trips/tripsPage.component";

const $trips = {
    getAllTrips: jest.fn()
};

describe("Trips Page", () => {
    test("loads the right number of trips", async () => {
        // Arrange
        $trips.getAllTrips.mockReturnValue(Promise.resolve(tripData));

        // Act
        const wrapper = shallow(TripsPage, {
            stubs: ['trip-list', 'create-trip', 'trip-filter', 'upcoming-trips'],
            propsData: { $trips }
        });

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.tripList).toHaveLength(tripData.length);
    });

    test("Errors out", async () => {
        // Arrange
        $trips.getAllTrips.mockReturnValue(Promise.reject(
            {data: {error: "Error"}}
        ));

        // Act
        const wrapper = shallow(TripsPage, {
            stubs: ['trip-list', 'create-trip', 'trip-filter', 'upcoming-trips'],
            propsData: { $trips }
        });

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errors).toHaveLength(1);
    });
});