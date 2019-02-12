# Repair Store Ticket System
>Currently being worked on

A handy ticket system for Repair Shops.

**Live demo:** // insert URL here

If you've worked at a repair shop you quickly realize mantaining proper communication regarding a customer's equipment can be a real problem. Both between the people who work at the shop, and between the shop and the customers.

Commercial solutions, while functional, had more functionality than what I needed at the time, and also where more expensive than what I was willing to pay month after month.
This solution has been working ok, since June 30, 2018 in a multi location repair shop.

A future SaaS version with a more functionality and a free tier is currently on the works.

## Features
- **User authentication** via Firebase Auth Ui
- Multiple locations
- Customers database
- Tickets database
- Prints tickets using a regular thermal printer
- Notes system inside each ticket
- Registers tickets as closed once the equipment is paid for and delivered

## Prerequisites
- A Google account
- Firebase Authentication
- Firebase Database
- Firebase Hosting

## Getting started

### Clone the repository
```shell
# Get the latest version
git clone https://github.com/IsraelMuCa/CHANGETHIS.git myproject

# cd into the directory
cd myproject
```

### Create a Firebase project

### Modify the project with the new data
Next, you'll need to change the ```example.env``` folder to ```.env``` and change the values inside the ```firebase.config.js``` file to

### Create the users and auth them in Firebase Auth

### Configure Firebase Hosting


## Contribute
(check https://opensource.guide/best-practices/)

### Built with
- HTML5
- CSS | [Bulma](https://bulma.io/)
- [Firebase](https://firebase.google.com/)
- [jQuery](https://jquery.com/)
- [Moment.js](http://momentjs.com/)
- [Print.js](http://printjs.crabbly.com/)
- [Font Awesome](https://fontawesome.com/)

### TODOs

(for this document and the rest of the code)
- Finish search.js
- While writing "Getting started" actually follow all the steps and make sure everything is working perfectly
- Finish the documentation
- Post it!