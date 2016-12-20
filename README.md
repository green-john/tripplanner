## Write a simple travel planner

- User must be able to create an account and log in.
- When logged in, a user can see, edit and delete trips he entered.
- Implement at least three roles with different permission levels: a
regular user would only be able to CRUD on their owned records, a user
manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
- When a trip is entered, it has Destination, StartDate, EndDate, Comment.
- When displayed, each entry also has day count to trip start (only for future trips).
- User can filter trips.
- Print travel plan for next month.
- REST API. Make it possible to perform all user actions via the API, including authentication
(If a mobile application and you don’t know how to create your own backend you can use Firebase.com
or similar services to create the API).
- All actions need to be done client side using AJAX, refreshing the page is not acceptable.
(If a mobile app, disregard this) In any case you should be able to explain how a REST API
works and demonstrate that by creating functional tests that use the REST Layer directly.
Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
- Bonus: unit and e2e tests!
- You will not be marked on graphic design, however, do try to keep it as tidy as possible.


## API
We have an api that supports 2 different types of objects. Users and Trips. Each of these
follows standard conventions for REST:

### Users:
- `GET /users/`: Returns all users
- `POST /users/`: Creates a new user
- `PUT /users/`: Updates all users
- `DELETE /users/`: Deletes list of all users
- `GET /users/<id>`: Returns user with ID
- `PUT /users/<id>`: Update single user
- `DELETE /users/<id>`: Delete the user

### Trips
- `GET /trips/`: Returns all trips for the user in the authentication header. This
method only works for authenticated users.
- `POST /trips/`: Creates a new trip.
- `PUT /users/`: _Not supported_
- `DELETE /users/`: _Not supported_
- `GET /users/<id>`: Returns the trip with the given id. Makes sure the user has
permissions to access this trip.
- `PUT /users/<id>`: Update one trip.
- `DELETE /users/<id>`: Delete one trip.

In addition we will support some additional endpoints 

## Running The tests
In order to run the tests, first install all the requirements, preferably inside a
virtualenv.

    `pip install -r requirements.txt`
   
then run the nose command:

    `nose2`
    
This will run all the tests.

## Running the experimental server
First install all the requirements and then run:

    `python manage.py runserver`
    
## TODO
- Deploy to a production server
- Write angular tests
- Make resilient to page reload in the browser.
