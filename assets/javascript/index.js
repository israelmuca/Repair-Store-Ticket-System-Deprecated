$(document).ready(function (){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAYkl5opTyW9YF7801KmgT9YUhpV0JhYGY",
        authDomain: "notas-xtm-fixc.firebaseapp.com",
        databaseURL: "https://notas-xtm-fixc.firebaseio.com",
        projectId: "notas-xtm-fixc",
        storageBucket: "notas-xtm-fixc.appspot.com",
        messagingSenderId: "768789228246"
    };

    firebase.initializeApp(config);
    var database = firebase.database();
    

    //GLOBAL VARIABLES
    //Hide/unhide booleans
    var minimizeCustData = false;
    var minimizeEquipData = false;
    
    var mostRecentTicketNum;
    var userKeyIfExists = false;

    //ticket data
    var location;
    var fullTicketNum;
    var shortTicketNum
    var date;

    //cust data
    var custName;
    var custLastName;
    var cellNum;
    var email;
    var zipCode;
    var prefContactMet;

    //equipment data
    var eqType;
    var eqBrand;
    var eqModel;
    var eqSerialNum;
    var characteristics;
    var accesories;
    var reasonToVisit;



    //GLOBAL SELECTORS
    //containers
    var custInfoBox = $('#customer-information');
    custInfoBox.hide();
    var eqInfoBox = $('#equipment-information');
    eqInfoBox.hide();

    var locationSelector = $('#location-select');
    var ticketNumSelector = $('#ticket-number');
    var dateSelector = $('#new-ticket-date-now');
    var custNameSelector = $('#cust-name');
    var custLastNameSelector = $('#cust-last-name');
    var cellNumSelector = $('#cellphone-number');
    var emailSelector = $('#email');
    var zipCodeSelector = $('#zip-code');
    //var prefContactMetSelector = $('#');       must research more
    var eqTypeSelector = $('#equipment-type');
    var eqBrandSelector = $('#equipment-brand');
    var eqModelSelector = $('#equipment-model');
    var eqSerialNumSelector = $('#equipment-serial-number');
    var characteristicsSelector = $('#equipment-characteristics');
    var accesoriesSelector = $('#equipment-accesories');
    var reasonToVisitSelector = $('#equipment-reason');
    var addTicketButtonSelector = $('#add-ticket');

    //Momentjs date handler
    //Sets the date for the new tickets to now; SAVE BUTTON SHOULD SAVE WITH HOUR
    dateSelector.val(moment().format("dddd, D MMMM 'YY, h:mm a"));
    dateSelector.prop('disabled', true);

    //Click listener for the validate customer button
    $('#validate-customer-button').on('click', checkCustExists);
    
    //Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-cust-data-click').on('click', function() {
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
    });
    $('.minimize-equipment-data-click').on('click', function() {
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
    });

    //Change listener to apply the 1st character of the new ticket number
    locationSelector.on('change', function() {
        location = this.value;
        getLatestTicketNum();
    });

    //

    //Click listener to save the form's data to FireBase
    addTicketButtonSelector.on('click', function(event){
        //Stop the button from reloading the page
        event.preventDefault();

        //get all the values
        location = locationSelector.val().trim();
        fullTicketNum = ticketNumSelector.val().trim();
        date = dateSelector.val().trim();

        custName = custNameSelector.val().trim();
        custLastName = custLastNameSelector.val().trim();
        cellNum = cellNumSelector.val().trim();
        email = emailSelector.val().trim();
        zipCode = zipCodeSelector.val().trim();
        //missing code for pref. contact method;

        eqType = eqTypeSelector.val().trim();
        eqBrand = eqBrandSelector.val().trim();
        eqModel = eqModelSelector.val().trim();
        eqSerialNum = eqSerialNumSelector.val().trim();
        characteristics = characteristicsSelector.val().trim();
        accesories = accesoriesSelector.val().trim();
        reasonToVisit = reasonToVisitSelector.val().trim();

        //push the values to the DB
        database.ref('/tickets').push({
            location: location,
            fullTicketNum: fullTicketNum,
            shortTicketNum: shortTicketNum,
            date: date,

            custName: custName,
            custLastName: custLastName,
            cellNum: cellNum,
            email: email,
            zipCode: zipCode,

            eqType: eqType,
            eqBrand: eqBrand,
            eqModel: eqModel,
            eqSerialNum: eqSerialNum,
            characteristics: characteristics,
            accesories: accesories,
            reasonToVisit: reasonToVisit,

            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        /*Take the user to the search page (for local work)*/
        var oldURL = window.location.href;
        var newURL = oldURL.replace("index", "search");
        window.location.replace(newURL);
        


        /*Take the user to the search page (for Git online work)
        window.location.href = 'search.html';
        */
    });

    //FUNCTIONS

    function setTicketNumber() {
        var dateForTicket = moment().format("YYMM-");
        shortTicketNum = mostRecentTicketNum++;
        if (location == 'Avanta') {
            ticketNumSelector.val('A-'+ dateForTicket + shortTicketNum);
        } else if (location == 'Brisas') {
            ticketNumSelector.val('B-'+ dateForTicket + shortTicketNum);
        } else if (location == 'Sienna') {
            ticketNumSelector.val('S-'+ dateForTicket + shortTicketNum);
        }
    }

    function getLatestTicketNum() {
        database.ref('/tickets').limitToLast(1).once('child_added', function(snapshot){
            mostRecentTicketNum = snapshot.val().shortTicketNum;
            if(!mostRecentTicketNum) {
                mostRecentTicketNum = 1
            }
        }).then(setTicketNumber);
    }// NEED TO TEST WHAT HAPPENS WHEN ANOTHER USER SAVES A NEW NOTE WHILE A USER IS SAVING A NOTE
    //IT SHOULD IN THEORY KEEP THE LISTENER OPEN AND CHANGE THE VALUE ACCORDINGLY
    //THE SAVE DATA VALIDATION SHOULD INCLUDE A CHECL ON "mostRecentTicketNum"

    //Query the DB to see if it returns a customer, then call viewCustomer to paint the cust-info
    function checkCustExists() {
        $(this).addClass('is-loading');
        var phoneNumToValidate = $('#cellphone-number-validate').val().trim();

        queryFirebaseCellNum(phoneNumToValidate);
    }

    //Receives the either nothing or the customer to paint it on the screen
    function viewCustomer() {
        if(userKeyIfExists == false) {
            console.log("The user hasn't been added, please add him");
        } else {
            console.log("The user exists, the key node is: " + userKeyIfExists);
        }

    }

    function queryFirebaseCellNum(pPhoneNumToValidate) {
        database.ref('customers').orderByChild('cellNum').equalTo(pPhoneNumToValidate).once('child_added', function(snapshot){
            console.log(snapshot.exists());
            userKeyIfExists = snapshot.key;
        })
        .then(viewCustomer), function(error) {
            console.log(error);
        };
    }

    function saveCustomer() {

    }

});