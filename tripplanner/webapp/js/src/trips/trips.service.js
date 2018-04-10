
export class TripService {
    constructor(httpService, loginService) {
        this.$http = httpService;
        this.$login = loginService;
    }

    getHeaders() {
        return {
            'Authorization': this.$login.getAuthorizationHeader()
        };
    }

    createTrip(tripData) {
        tripData.user_id = this.$login.getUserId();
        return this.$http({
            url: '/trips/',
            method: 'post',
            data: tripData,
            headers: this.getHeaders()
        }).then(response => {
            return response.data;
        }).catch(error => {
            throw error;
        });
    }

    getAllTrips() {
        return this.$http({
            url: '/trips/',
            method: 'get',
            headers: this.getHeaders()
        }).then(response => {
            return response.data;
        }).catch(response => {
            throw response;
        });
    }

    filterTrips(params) {
        return this.$http({
            url: '/trips/filter/',
            method: 'post',
            data: params,
            headers: this.getHeaders()
        }).then(response => {
            return response.data;
        }).catch(response => {
            throw response;
        });
    }

    getNextMonthItinerary() {
        return this.$http({
            url: '/trips/next_month/',
            method: 'get',
            headers: this.getHeaders()
        }).then(response => {
            return response.data;
        }).catch(response => {
            throw response;
        });
    }
}
