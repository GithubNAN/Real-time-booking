# Real-time-booking
Use socket io connect front end(counter) and back end(kitchen) make real time booking without cashier possible

## About
this is only a demo app showing the basic mechanism how a customer order in real time, once the server recieve the order and it send to back end(kitchen) handle the request, once the order finish, back end can confirm and notify the front end order are ready to pick up.

The challange is each client a individual people interact with a grounp of people(kitchen), so seprate channel must be allocated before the connection established.

## Setup
* Install the dependencies:  ```npm install```
* Start the server:  ```node index.js```
* View the booking page: http://localhost:10086/
