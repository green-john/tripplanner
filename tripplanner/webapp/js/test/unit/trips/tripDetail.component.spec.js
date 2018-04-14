import { shallow } from '@vue/test-utils';
import TripComponent from 'trips/tripDetail.component';

describe("Trip Component", () => {
    test("Display upcoming trip", () => {
        // Arrange
        const tripData = {
            destination: "a",
            start_date: "24/05/2018",
            end_date: "24/06/2018",
            days_left: 5,
            in_progress: false
        };

        // Act
        const wrapper = shallow(TripComponent, {
            propsData: {
                trip: tripData
            }
        });

        // Assert
        const destinationLabel = wrapper.find("label.destination").text();
        const daysLeftLabel = wrapper.find("label.days-left").text();
        expect(destinationLabel).toBe("Trip to a");
        expect(daysLeftLabel).toBe("Go in 5 day(s)");
    });

    test("Display overdue trip", () => {
        // Arrange
        const tripData = {
            destination: "a",
            start_date: "24/05/2018",
            in_progress: false
        };

        // Act
        const wrapper = shallow(TripComponent, {
            propsData: {
                trip: tripData
            }
        });

        // Assert
        const destinationLabel = wrapper.find("label.destination").text();
        const daysLeftLabel = wrapper.find("label.overdue").text();
        expect(destinationLabel).toBe("Trip to a");
        expect(daysLeftLabel).toBe("Finished");
    });
});