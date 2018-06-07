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

    //ticket data
    var location;
    var ticketNum;
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
    
    //Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-cust-data-click').on('click', function() {
        if (!minimizeCustData) {
            $('.minimize-cust-data').hide();
            minimizeCustData = true;
        } else {
            $('.minimize-cust-data').show();
            minimizeCustData = false;
        }
    });
    $('.minimize-equipment-data-click').on('click', function() {
        if (!minimizeEquipData) {
            $('.minimize-equipment-data').hide();
            minimizeEquipData = true;
        } else {
            $('.minimize-equipment-data').show();
            minimizeEquipData = false;
        }
    });

    //Change listener to apply the 1st character of the new ticket number
    locationSelector.on('change', function() {
        if (this.value == 'Avanta') {
            ticketNumSelector.val('A');
        } else if (this.value == 'Brisas') {
            ticketNumSelector.val('B');
        } else if (this.value == 'Sienna') {
            ticketNumSelector.val('S');
        }
        //SHOULD CALL A FUNCTION TO CHECK THE LATEST TICKET, AND CREATE A CONSECUTIVE ONE
        //IT SHOULD THEN UNHIDE THE 'DATOS DEL CLIENTE' CONTAINER
        //ONCE THE 'DATOS DEL CLIENTE' CONTAINER IS FILLED, UNHIDE DATOS DEL EQUIPO
    });

    //Click listener to save the form's data to FireBase
    addTicketButtonSelector.on('click', function(event){
        //Stop the button from reloading the page
        event.preventDefault();

        //get all the values
        location = locationSelector.val().trim();
        ticketNum = ticketNumSelector.val().trim();
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
            ticketNum: ticketNum,
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

            internalNotes: 0,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        /*Take the user to the search page (for local work)
        var oldURL = window.location.href;
        var newURL = oldURL.replace("index", "search");
        window.location.replace(newURL);
        */


        /*Take the user to the search page (for Git online work)*/
        window.location.href = 'search.html';
        
    });

});