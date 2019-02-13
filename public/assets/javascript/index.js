$(document).ready(function (){
// --------------------- ON LOAD EVENTS - START ---------------------
    // Initialize Firebase
    // 'config' is being imported through the HTML's script tag (./.env/firebase.config.js)
    // For your own development, you need to change the 'example.env' folder to '.env' and change the values inside to reflect the values you get from Firebase
    firebase.initializeApp(config);
    var database = firebase.database();

    //Verify if the user is logged in
    checkLoginStatus();

    //Sets the date for the new tickets to now
    $('#new-ticket-date-now').val(moment().format("dddd, D MMMM 'YY, h:mm a"));
    $('#new-ticket-date-now').prop('disabled', true);
// --------------------- ON LOAD EVENTS -   END ---------------------
//-----------------
// --------------------- GLOBAL VARIABLES - START ---------------------
    //GLOBAL VARIABLES
    var startDate = moment('1990-04-26T10:15:00'); // Patch to fix firebase's ascending order only problem
    var nowDate;
    var descOrder;

    //Hide/unhide booleans
    var minimizeCustData = false;
    var minimizeEquipData = false;
    
    var mostRecentTicketNum;

    var userName;

    var printTimes = 0;

    // Ticket data
    var ticketDBID;
    var location;
    var fullTicketNum;
    var shortTicketNum;
    var searchTicketNum;
    var date;
    var ticketCreatedBy;

    // Cust data
    var custDBID;
    var custName;
    var custLastName;
    var cellNum;
    var email;
    var zipCode;
    var contactMetCall;
    var contactMetWhats;
    var contactMetEmail;
    
    // Equipment data
    var eqType;
    var eqBrand;
    var eqModel;
    var eqSerialNum;
    var characteristics;
    var accesories;
    var reasonToVisit;

    // GLOBAL SELECTORS
    // Buttons
    var saveExistCustButton = $('#save-exist-customer-button');
    saveExistCustButton.hide(); //only activated when a cust exists and we want to modify it
    var saveNewCustButton = $('#save-new-customer-button');
    saveNewCustButton.hide(); //only activated when a cust exists and we want to modify it
    var confCustButton = $('#confirm-customer-button');
    var modCustButton = $('#modify-customer-button');
    var addTicketButton = $('#add-ticket-button');

    // Containers
    var validateCustBox = $('#validate-customer-exists');
    var custInfoBox = $('#customer-information');
    custInfoBox.hide();
    var eqInfoBox = $('#equipment-information');
    eqInfoBox.hide();
    var ticketDataBox = $('#ticket-data');
    ticketDataBox.hide();

    // Information fields (inputs, checks, etc...)
    var custNameSelector = $('#cust-name');
    var custLastNameSelector = $('#cust-last-name');
    var cellNumSelector = $('#cellphone-number');
    var emailSelector = $('#email');
    var zipCodeSelector = $('#zip-code');
    var contactMetCallSelector = $('#contact-call');
    var contactMetWhatsSelector = $('#contact-whats');
    var contactMetEmailSelector = $('#contact-email');

    var locationSelector = $('#location-select');
    var ticketNumSelector = $('#ticket-number');
    var dateSelector = $('#new-ticket-date-now');

    var eqTypeSelector = $('#equipment-type');
    var eqBrandSelector = $('#equipment-brand');
    var eqModelSelector = $('#equipment-model');
    var eqSerialNumSelector = $('#equipment-serial-number');
    var characteristicsSelector = $('#equipment-characteristics');
    var accesoriesSelector = $('#equipment-accesories');
    var reasonToVisitSelector = $('#equipment-reason');

// --------------------- GLOBAL VARIABLES -   END ---------------------
//-----------------
// --------------------- EVENT LISTENERS - START ---------------------

    // Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-cust-data-click').on('click', minCustData);
    $('.minimize-equipment-data-click').on('click', minEquipData);

    // Click listener for the validate customer button
    $('#validate-customer-button').on('click', queryFirebaseCellNum);

    // Click listeners for the customer's data buttons (confirm, modify and both saves)
    confCustButton.on('click', confCustData);
    modCustButton.on('click', modCustData);
    saveExistCustButton.on('click', saveExistCustData);
    saveNewCustButton.on('click', saveNewCustData);

    // Click listener to show the button in the modal and prepare to print it
    $('#confirm-ticket-button').on('click', prepareModalPrint); 
    
    // Now send from the modal to Firebase after printing
    addTicketButton.on('click', createTicket); 

    // Change listener to apply the 1st character of the location to the new ticket number
    locationSelector.on('change', function() {
        location = this.value;
        getLatestTicketNum();
    });

    // Click listener for logout button
    $('#log-out-button').on('click', function(){
        firebase.auth().signOut();
    });

    // Click listener for the ticket print button
    $('#print-ticket-button').on('click', function(){
        printJS('print-view-ticket', 'html');
        printTimes++;
        if(printTimes == 2) { // We want to make sure the ticket is printed twice, once for the customer another for the company
            addTicketButton.show();
        }
    })

// --------------------- EVENT LISTENERS -   END ---------------------
//-----------------
// --------------------- FUNCTIONS - START ---------------------

    // Verify the user's login status
    function checkLoginStatus() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                // Take the user to the login page
                window.location.href = 'login.html';
            } else {
                // Validate user is auth
                isUserAuth(user.uid);
            }
        });
    }

    // Check if user is authorized to actually use the system
    // Was added because anyone can signup using Google auth, but if they're not on the DB they can't do anything in the system
    function isUserAuth(pUserUid) {
        // Query the DB
        database.ref('users')
        .orderByChild('uid')
        .equalTo(pUserUid)
        .once('value')
        .then(function(snapshot) {
            if(snapshot.val()) {
                // User exists, save the user name and continue
                snapshot.forEach(function(userSnapshot){
                    userName = userSnapshot.val().name;
                    $('#user-name-log-out').text(userName);
                })
            } else {
                // User not authorized, tell them, then take them to the login

                // Modify the texts in the modal
                $('#modal-user-auth-title').text('The user is not authorized!');
                $('#modal-user-auth-body').html('<p>Make sure to login using the provided user</p>');

                // Activate the modal
                $('#modal-user-auth').addClass('is-active');

                // Send the user back to login
                setTimeout(function(){
                    window.location.href = 'login.html';
                }, 5000);
            }
        })
    }

    // Query Firebase for the phone number
    function queryFirebaseCellNum() {
        if(!($('#cellphone-number-validate').val())) {
            $('#empty-phone-validation').text('You need to write a phone number!');
        } else {
            $('#validate-customer-button').addClass('is-loading');
            var phoneNumToValidate = $('#cellphone-number-validate').val().trim();

            database.ref('customers')
            .orderByChild('cellNum')
            .equalTo(phoneNumToValidate)
            .once('value')
            .then(function(snapshot) {
                if(snapshot.val()) {
                    // Customer exists in DB
                    snapshot.forEach(function(snapshotChild) {
                        custDBID = snapshotChild.key;
                        viewOrCreateCustomer(snapshotChild.val());
                    })
                } else {
                    // Customer doesn't exist in DB
                    viewOrCreateCustomer();
                }
            });
        }
    }

    // Function to view a customer (customer), or creates a customer ()
    function viewOrCreateCustomer(pFirebaseVal) {
        validateCustBox.hide(900);
        custInfoBox.show();
        if(pFirebaseVal) {
            // Logic for customer exists
            custNameSelector.val(pFirebaseVal.custName);
            custLastNameSelector.val(pFirebaseVal.custLastName);
            cellNumSelector.val(pFirebaseVal.cellNum);
            emailSelector.val(pFirebaseVal.email);
            zipCodeSelector.val(pFirebaseVal.zipCode);
            if (pFirebaseVal.contactMethods.whats) {
                contactMetWhatsSelector.prop('checked', true);
            } else {
                contactMetWhatsSelector.prop('checked', false);
            }
            if (pFirebaseVal.contactMethods.call) {
                contactMetCallSelector.prop('checked', true);
            } else {
                contactMetCallSelector.prop('checked', false);
            }
            if (pFirebaseVal.contactMethods.email) {
                contactMetEmailSelector.prop('checked', true);
            } else {
                contactMetEmailSelector.prop('checked', false);
            }

        } else {
            modCustData($('#cellphone-number-validate').val().trim());
        }
    }

    // Modifies fields to let the user change customer's data
    function modCustData(pPhoneNum) {
        // If the function is called because a customer exists and wants to be modified it receives an object
        // If the function is called because a customer doesn't exist, prefill the phone number it is received
        if(typeof(pPhoneNum) == 'object') {
            //hide/show buttons as needed
            modCustButton.hide();
            confCustButton.hide();
            saveExistCustButton.show();
        } else {
            cellNumSelector.val(pPhoneNum);
            //hide/show buttons as needed
            modCustButton.hide();
            confCustButton.hide();
            saveExistCustButton.hide();
            saveNewCustButton.show();
        } 

        // Remove the 'disabled' prop from customer fields
        cellNumSelector.prop('disabled', false);
        emailSelector.prop('disabled', false);
        custNameSelector.prop('disabled', false);
        custLastNameSelector.prop('disabled', false);
        zipCodeSelector.prop('disabled', false);
        contactMetWhatsSelector.prop('disabled', false);
        contactMetCallSelector.prop('disabled', false);
        contactMetEmailSelector.prop('disabled', false);
    }

    // Customer exists in DB and info is correct, proceed with ticket creation
    function confCustData() {
        minCustData();
        ticketDataBox.show();
        eqInfoBox.show();
    }

    // Customer exists in DB and info has been modified, save cust
    function saveExistCustData() {
        // Get data from inputs
        custName = custNameSelector.val().trim();
        custLastName = custLastNameSelector.val().trim();
        cellNum = cellNumSelector.val().trim();
        email = emailSelector.val().trim();
        zipCode = zipCodeSelector.val().trim();
        contactMetCall = contactMetCallSelector[0].checked;
        contactMetEmail = contactMetEmailSelector[0].checked;
        contactMetWhats = contactMetWhatsSelector[0].checked;

        if (!custName || !custLastName || !cellNum || !email || !zipCode ) {
            $('#error-text-customer').removeClass('is-invisible');
            return;
        }
        $('#error-text-customer').addClass('is-invisible');


        database.ref('/customers')
        .child(custDBID)
        .update({
            custName: custName,
            custLastName: custLastName,
            cellNum: cellNum,
            email: email,
            zipCode: zipCode
        })
        .then(database.ref('/customers')
        .child(custDBID + '/contactMethods')
        .update({
            whats: contactMetWhats,
            call: contactMetCall,
            email: contactMetEmail
        }), function(error){
            if(error) {
                console.log('The update failed', error);
            }
        })
        .then( function() {
            modCustButton.show();
            confCustButton.show();
            saveExistCustButton.hide();

            // Remove the 'disabled' prop from customer fields
            cellNumSelector.prop('disabled', true);
            emailSelector.prop('disabled', true);
            custNameSelector.prop('disabled', true);
            custLastNameSelector.prop('disabled', true);
            zipCodeSelector.prop('disabled', true);
            contactMetWhatsSelector.prop('disabled', true);
            contactMetCallSelector.prop('disabled', true);
            contactMetEmailSelector.prop('disabled', true);
        })
    }

    // If the customer doesn't exist in DB, create new customer
    function saveNewCustData() {
        // Get data from inputs
        custName = custNameSelector.val().trim();
        custLastName = custLastNameSelector.val().trim();
        cellNum = cellNumSelector.val().trim();
        email = emailSelector.val().trim();
        zipCode = zipCodeSelector.val().trim();
        contactMetCall = contactMetCallSelector[0].checked;
        contactMetEmail = contactMetEmailSelector[0].checked;
        contactMetWhats = contactMetWhatsSelector[0].checked;

        if (!custName || !custLastName || !cellNum || !email || !zipCode ) { // Show an error if any field is empty
            $('#error-text-customer').removeClass('is-invisible');
            return;
        }
        $('#error-text-customer').addClass('is-invisible');

        // Calculate the saved date right before the values are saved
        nowDate = moment().format();
        descOrder = -Math.abs(startDate.diff(nowDate, 'seconds')); // This value is used on the DB to set a descending order due to a problem with Firebase

        custDBID = database.ref().child('customers').push().key;

        // Call the database and save the data
        database.ref('/customers')
        .child(custDBID)
        .set({
            custID: custDBID,
            custName: custName,
            custLastName: custLastName,
            cellNum: cellNum,
            email: email,
            zipCode: zipCode,
            descOrder: descOrder,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
        .then(
            database.ref('/customers')
            .child(custDBID + '/contactMethods')
            .set(
                {
                whats: contactMetWhats,
                call: contactMetCall,
                email: contactMetEmail
                }), 
                function(error){
                    if(error) {
                        console.log('The creation of the new customer failed: ', error);
                    }
                }
            )
        .then( 
            function() {
                modCustButton.show();
                confCustButton.show();
                saveExistCustButton.hide();
                saveNewCustButton.hide();

                // Add the 'disabled' prop to customer fields
                cellNumSelector.prop('disabled', true);
                emailSelector.prop('disabled', true);
                custNameSelector.prop('disabled', true);
                custLastNameSelector.prop('disabled', true);
                zipCodeSelector.prop('disabled', true);
                contactMetWhatsSelector.prop('disabled', true);
                contactMetCallSelector.prop('disabled', true);
                contactMetEmailSelector.prop('disabled', true);
            }
        )
    }

    // Confirm all the data was entered, and activate the print modal
    function prepareModalPrint() {

        // Validate there's no empty fields
        custName = custNameSelector.val().trim();
        custLastName = custLastNameSelector.val().trim();

        fullTicketNum = ticketNumSelector.val().trim();
        date = dateSelector.val().trim();

        eqType = eqTypeSelector.val();
        eqBrand = eqBrandSelector.val().trim();
        eqModel = eqModelSelector.val().trim();
        eqSerialNum = eqSerialNumSelector.val().trim();
        characteristics = characteristicsSelector.val().trim();
        accesories = accesoriesSelector.val().trim();
        reasonToVisit = reasonToVisitSelector.val().trim();

        // Show an error if any field is empty
        if (!fullTicketNum || !eqType || !eqBrand || !eqModel || !eqSerialNum || !characteristics || !accesories || !reasonToVisit ) {
            $('#error-text-ticket').removeClass('is-invisible'); 
            return;
        }
        $('#error-text-ticket').addClass('is-invisible');

        // Activate and pass the values to the modal
        $('#modal-ticket').addClass('is-active');

        addTicketButton.hide();
        
        $('#print-view-ticket-num').text(fullTicketNum);
        $('#print-view-ticket-date').text(date);
        $('#print-view-ticket-cust').text(custName + custLastName);
        $('#print-view-ticket-brandmodel').text(eqBrand + eqModel);
        $('#print-view-ticket-serial').text(eqSerialNum);
        $('#print-view-ticket-characteristics').text(characteristics);
        $('#print-view-ticket-accesories').text(accesories);
        $('#print-view-ticket-reason').text(reasonToVisit);
    }

    // Once the modal is printed, save the ticket!
    function createTicket() {

        // Calculate the saved date right before the values are saved
        nowDate = moment().format();
        descOrder = -Math.abs(startDate.diff(nowDate, 'seconds'));

        ticketDBID = database.ref().child('tickets').push().key;

        // Call the db to save the ticket
        database.ref('/tickets')
        .child(ticketDBID)
        .set({
            custID: custDBID,
            custName: custName,
            custLastName: custLastName,

            location: location,
            fullTicketNum: fullTicketNum,
            searchTicketNum: searchTicketNum,
            ticketID: ticketDBID,
            ticketCreatedBy: ticketCreatedBy,
            date: date,

            eqType: eqType,
            eqBrand: eqBrand,
            eqModel: eqModel,
            eqSerialNum: eqSerialNum,
            characteristics: characteristics,
            accesories: accesories,
            reasonToVisit: reasonToVisit,
            internalNotesCounter: 1,

            descOrder: descOrder,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }).then(
                // Call the db to save the customer's new ticket number
                database.ref('/customers')
                .child(custDBID + '/tickets/' + ticketDBID)
                .set({
                    ticketID: ticketDBID,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                })
                ).then(
                    // Call the db to save the new location's next ticket number
                    database.ref('/locations')
                    .child(location)
                    .update({
                        latestTicketNum: shortTicketNum
                    })).then(goToSearch); // Once everything is done, go to SearchTickets
    }

    function getLatestTicketNum() {

        // Get the user who is creating the ticket
        $('#user-name-ticket').val(userName);
        ticketCreatedBy = userName;

        // Ask the db what's the next ticket number
        database.ref('/locations')
        .child(location)
        .once("value")
        .then(function(latestTicketNumberSnapshot) {
            mostRecentTicketNum = latestTicketNumberSnapshot.val().latestTicketNum

        }).then( function() {
            // Get the date and print the ticket number to screen
            var dateForTicket = moment().format("YYMM-");
            shortTicketNum = mostRecentTicketNum+1;
            if (location == 'Midtown') {
                ticketNumSelector.val(dateForTicket + 'M' + shortTicketNum);
                searchTicketNum = "M" + shortTicketNum;
            } else if (location == 'Uptown') {
                ticketNumSelector.val(dateForTicket + 'U' + shortTicketNum);
                searchTicketNum = "U" + shortTicketNum;
            } else if (location == 'Downtown') {
                ticketNumSelector.val(dateForTicket + 'D' + shortTicketNum);
                searchTicketNum = "D" + shortTicketNum;
            }
            })
    }

    // Minimize Customer Data Container
    function minCustData() {
        if (!minimizeCustData) {
            $('.minimize-cust-data').hide();
            $('#cust-data-svg').removeClass('fa-minus-circle');
            $('#cust-data-svg').addClass('fa-plus-circle');
            minimizeCustData = true;
        } else {
            $('.minimize-cust-data').show();
            $('#cust-data-svg').removeClass('fa-plus-circle');
            $('#cust-data-svg').addClass('fa-minus-circle');
            minimizeCustData = false;
        }
    }

    // Minimize Equipment Data Container
    function minEquipData() {
        if (!minimizeEquipData) {
            $('.minimize-equipment-data').hide();
            $('#equipment-data-svg').removeClass('fa-minus-circle');
            $('#equipment-data-svg').addClass('fa-plus-circle');
            minimizeEquipData = true;
        } else {
            $('.minimize-equipment-data').show();
            $('#equipment-data-svg').removeClass('fa-plus-circle');
            $('#equipment-data-svg').addClass('fa-minus-circle');
            minimizeEquipData = false;
        }
    }

    function goToSearch() {
        //Take the user to the search page
        window.location.href = 'search.html';
    }
// --------------------- FUNCTIONS -   END ---------------------
});