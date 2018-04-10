import { shallow } from "@vue/test-utils";
import { tripData } from "./data";
import UpcomingTrips from "trips/upcomingTrips.component";

const $trips = {
    getNextMonthItinerary: jest.fn()
};

describe("Upcoming Trips", () => {
    test("Renders the trips", async () => {
        // Arrange
        $trips.getNextMonthItinerary.mockReturnValue(Promise.resolve(tripData));
        const wrapper = shallow(UpcomingTrips, {
            stubs: ['trip-list'],
            propsData: { $trips }
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.nextMonthTrips).toHaveLength(tripData.length);
    });

    test("Error querying trips", async () => {
        // Arrange
        $trips.getNextMonthItinerary.mockReturnValue(Promise.reject(
            {data: {error: "Error"}}));
        const wrapper = shallow(UpcomingTrips, {
            stubs: ['trip-list'],
            propsData: { $trips }
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errors).toHaveLength(1);
    });
});