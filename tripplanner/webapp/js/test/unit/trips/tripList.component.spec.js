import { shallow } from "@vue/test-utils";
import { tripData } from "./data";
import TripList from "trips/tripList.component";

describe("Trip List", () => {
    test("Displays right number of elements", () => {
        // Arrange
        // Act
        const wrapper = shallow(TripList, {
            stubs: ['trip-detail'],
            propsData: {
                tripList: tripData
            }
        });

        // Assert
        expect(wrapper.findAll("li").length).toBe(tripData.length);
    });
});