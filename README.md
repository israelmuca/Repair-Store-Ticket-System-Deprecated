# Repair Store Ticket System

**A ticketing system for Repair Shops.**

If you've worked at a repair shop you quickly realize mantaining proper communication between your team regarding a customer's equipment or communication with them can be a real problem.

Commercial solutions were great, except they had more functionality than what I needed at the time, and also where more expensive than what I was willing to pay at the moment and four our (basic) needs.  
This solution has been working for over 6 months in a multi location repair shop.

---
>**Live demo:**  
>
>https://repair-store-ticket-system-ex.firebaseapp.com/  
>
>User: testuser@test.com  
>Pwd: Testing1
---

## Features
- **User authentication** via Firebase Auth Ui
- Multiple locations
- Customers database
- Tickets database
- Prints tickets using a regular thermal printer
- Team notes system inside each ticket
- Registers tickets as closed once the equipment is paid for and delivered

## Prerequisites
- A Google account - _regular or G Suite, doesn't matter_
- 15 minutes to set everything up

## Getting started
[Getting started](./docs/GETTING_STARTED.md)

## Using the system
[Using the system](./docs/USING_THE_SYSTEM.md)

## Contribute
While the code is functional as it is, there's a lot of room for improvement.  
I added a [TODO](./docs/TODO.md) with things I think may add value to the project, but obviously I'm surely missing more things.  
I'm always open to hearing what someone may need.  
Important to note that a future SaaS version with more functionality and a free tier is currently on the works, it will be released later this year.  
It's being done with a proper backend (90% done) in Node.js + Express and a Vue.js frontend (30% done).

## Built with
- [Bulma](https://bulma.io/)
- [Firebase](https://firebase.google.com/)
- [jQuery](https://jquery.com/)
- [Moment.js](http://momentjs.com/)
- [Print.js](http://printjs.crabbly.com/)
- [Font Awesome](https://fontawesome.com/)
- ❤️

## Hosted in
- [Firebase](https://firebase.google.com/docs/hosting/quickstart)
