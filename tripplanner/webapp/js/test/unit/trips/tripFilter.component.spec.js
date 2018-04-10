import { shallow } from "@vue/test-utils";
import { tripData as tripList }  from "./data";
import TripFilter from "trips/tripFilter.component";

const $trips = {
    filterTrips: jest.fn()
};

describe("Trip Filter component", () => {
    test("Return filtered trips", async () => {
        // Arrange
        $trips.filterTrips.mockReturnValue(Promise.resolve(tripList));
        const wrapper = shallow(TripFilter, {
            stubs: ['trip-list'],
            propsData: { $trips },
            data: {
                filterDestination: "a",
                filterStartDate: "05/03/2016/",
                filterEndDate: "04/02/2017",
            },
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.trips).toHaveLength(tripList.length);
    });

    test("Error querying service", async () => {
        // Arrange
        $trips.filterTrips.mockReturnValue(Promise.reject(
            {data: {error: "error"}}));
        const wrapper = shallow(TripFilter, {
            stubs: ['trip-list'],
            propsData: { $trips },
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errors).toHaveLength(1);
    });
});