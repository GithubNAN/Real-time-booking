# Real-time-booking
Use socket io connect front end(counter) and back end(kitchen) make real time booking without cashier possible

## About
this is only a demo app showing the basic mechanism how a restaurant deal with customer order in real time without have person in counter, once the server recieve the order and it send to back end(kitchen) handle the request, once the order finish, the kitch confirm and notify the front end that order are ready to pick up.

The challange is each client a individual people interact with a grounp of people(kitchen), so seprate channel must be allocated before the connection established. mulitple client can be connected simultaneously 

## Setup
* Install the dependencies:  ```npm install```
* Start the server:  ```node index.js```
* View the booking page: http://localhost:10086/

## Future upgrades
* Sync back end order infomation