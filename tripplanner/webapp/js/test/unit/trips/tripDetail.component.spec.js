import { shallow } from '@vue/test-utils';
import TripComponent from 'trips/tripDetail.component';

describe("Trip Component", () => {
    test("Display upcoming trip", () => {
        // Arrange
        const tripData = {
            destination: "a",
            start_date: "24/05/2018",
            days_left: 5
        };

        // Act
        const wrapper = shallow(TripComponent, {
            propsData: {
                trip: tripData
            }
        });

        // Assert
        const destinationLabel = wrapper.findAll("label").at(0).text();
        const daysLeftLabel = wrapper.findAll("label").at(1).text();
        expect(destinationLabel).toBe("Trip to a in 24/05/2018.");
        expect(daysLeftLabel).toBe("5 day(s) left.");
    });

    test("Display overdue trip", () => {
        // Arrange
        const tripData = {
            destination: "a",
            start_date: "24/05/2018",
        };

        // Act
        const wrapper = shallow(TripComponent, {
            propsData: {
                trip: tripData
            }
        });

        // Assert
        const destinationLabel = wrapper.findAll("label").at(0).text();
        const daysLeftLabel = wrapper.findAll("label").at(1).text();
        expect(destinationLabel).toBe("Trip to a in 24/05/2018.");
        expect(daysLeftLabel).toBe("Overdue.");
    });
});