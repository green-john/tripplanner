import { shallow } from "@vue/test-utils";
import CreateTripComponent from "trips/createTrip.component";

const $trips = {
    createTrip: jest.fn()
};

describe("Create Trip component", () => {
    test("Success", async () => {
        // Arrange
        $trips.createTrip.mockReturnValue(Promise.resolve());
        const wrapper = shallow(CreateTripComponent, {
            propsData: {
                $trips
            },
            data: {
                destination: "a",
                start_date: "04/12/2018",
                end_date: "14/12/2018",
                comment: "a",
            }
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.successMsg).toBe("Trip to a created!");
    });

    test("Create trip service fails", async () => {
        // Arrange
        $trips.createTrip.mockReturnValue(Promise.reject({data: {error: "Error"}}));
        const wrapper = shallow(CreateTripComponent, {
            propsData: {
                $trips
            },
            data: {
                destination: "a",
                start_date: "04/12/2018",
                end_date: "14/12/2018",
                comment: "a",
            }
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errorMsg).toBe("Error creating trip");
        expect(wrapper.vm.errors).toHaveLength(1);
    });

    test("Empty fields fails", async () => {
        // Arrange
        const wrapper = shallow(CreateTripComponent, {
            propsData: $trips
        });

        // Act
        wrapper.find("button").trigger("click");

        // Assert
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errors).toHaveLength(4);
    })
});
