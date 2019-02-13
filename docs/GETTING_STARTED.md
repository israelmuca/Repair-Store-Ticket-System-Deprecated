
# Getting started

## Create a Firebase project
Go to the [Firebase console](https://console.firebase.google.com).  
Log in with your Google account and select:  
`Add project`  
Choose the _Project name_ and _Project ID_.  
Accept the terms and Continue.

## Clone the repository
```shell
# Get the latest version
git clone https://github.com/israelmuca/Repair-Store-Ticket-System.git myproject

# cd into the project
cd myproject

# change the .env folder
mv public/assets/javascript/example.env public/assets/javascript/.env
```

## Integrate Firebase into the project
From the project overview page in the [Firebase console](https://console.firebase.google.com/) clic **Add Firebase to your web app**.  
You’ll get a script with a `var config = {...}`.  
You have to update the `firebase.config.js` file in your `.env` folder with these new values.

### Install the Firebase CLI
You may choose to install it into the project, or add the _-g_ flag to make it global.  
Since I use it on more projects, I chose to install it globally.
```shell
npm i -g firebase-tools
```
### Configure Firebase into your project

From the root of the project, login to your account
```shell
firebase login
```

Now, test your login
```shell
firebase list
```
It should show you your previously created project.  

Then, initialize firebase in your project
```shell
firebase init
```
You'll be presented with several Firebase options, you want to **choose hosting** only.  
Next, firebase will ask to choose or create a project, choose the previously created project.  
After, firebase will ask for a public directory, just click _enter_.  
Then, firebase will ask if you want to configure the project as a SPA, just click _enter_ to choose **NO**.  
Last, firebase will ask if you want to rewrite _public/index.html_, just click _enter_ to choose **NO**.  

There! Now your project is ready to be deployed to Firebase hosting.

# Lets deploy!

```shell
firebase deploy
```

Now, you have uploaded the system and it is connected to your firebase project, but we still have some final steps to do before we can begin using it:

### Authentication
Again go to the [Firebase console](https://console.firebase.google.com), and on the menu, go to _Authentication_, then go to _Sign-in providers_.  
I use **Email/Password** and **Google**, you may change those options, if you do so, you’ll have to change the `/login.html` page as well.

On the menu, go to _Database_ and **select the Realtime Database**
>This is specially important, as this was developed before Firestore was released and compatibility has not been tested.  

Start in `test mode` for development simplicity _we will be changing the database rules at the end_.

Now, go ahead and create a user in the actual login page. Once you’re logged in, you will be shown an error, that your user is not authorized. **This is expected behavior**.  
Go back to the [Firebase console](https://console.firebase.google.com), go to _Authentication_ and then _Users_. Copy the new user’s UID.  
![users screen](https://github.com/israelmuca/repair-store-ticket-system/raw/master/docs/assets/user-created.png "Users screen")


Go back to the database, and hover over the main node in the db, and click on the _plus_ sign on the right side.  
In _Name_ write: **users**, and then click on the plus sign at the right side again to add another node. In the new _Name_ node, paste the UID you copied before, and click on the plus sign, _again_.  
On the new _Name_ node, write `uid` and in value, paste the actual UID. On the parent node, click _again_ on the plus sign, to create another child node, which will be a sibling for the uid key-value pair. This one will be called: `name` and the value will be the user’s name.  

The final result should look like the picture:  
![users node](https://github.com/israelmuca/repair-store-ticket-system/raw/master/docs/assets/users-node.png "Users node")  

Now, if you login again with the user, you won’t get the error message!  
This process has to be repeated for every user you wish to add to the project.


## Database rules
While we're in this screen, go to the `Rules` option, change those rules for these ones:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "tickets": {".indexOn": ["descOrder","cellNum"]},
    "users": {".indexOn": "uid"},
    "customers": {".indexOn": "cellNum"}
  }
}
```
These rules make sure that only the authorized users will be updating the database, and will add three indexes, to make sure searches are as fast as they can be.  


## Add locations
Finally, we'll be adding the locations to the database and the HTML.  
The process in the database is quite similar to adding users. In this case, for the example, we’ll be using 3 fake locations.  
![locations node](https://github.com/israelmuca/repair-store-ticket-system/raw/master/docs/assets/locations-node.png "Locations node")  

Notice that all 3 locations have a child node with `latestTicketNum` set to 0.  
This is because when you're creating a ticket, and you select a location to own it, it will query the database to get the latest ticket that has been set on that specific location, add 1, and use it for this new ticket.  
You may set another value if you need to.

You need to update these values in the HTML and JS as well.  
First go to [index.html](https://github.com/israelmuca/Repair-Store-Ticket-System/blob/master/public/index.html) and change lines 237 - 239 to reflect your locations added in Firebase Database.
Then go to [index.js](https://github.com/israelmuca/Repair-Store-Ticket-System/blob/master/public/assets/javascript/index.js) and change lines 525 - 537 to reflect your locations added in Firebase Database.

## Further customize the code
Since this project was created with only one instance of it in mind, I didn't plan on making it easy to change the variables for each instance. If you wish to customize it, you'll have to go directly to the HTML.  

Remember to do `firebase deploy` with any changes that you do to your code!

## Issues
If you have any problems implementing this, please open an issue in the repo!  
If there's any questions, I'll create a FAQ.  
Cheers!