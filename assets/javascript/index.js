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
    var prefContactMetSelector = $('#');
    var eqTypeSelector = $('#equipment-type');
    var eqBrandSelector = $('#equipment-brand');
    var eqModelSelector = $('#equipment-model');
    var eqSerialNumSelector = $('#equipment-serial-number');
    var characteristicsSelector = $('#equipment-characteristics');
    var accesoriesSelector = $('#equipment-accesories');
    var reasonToVisitSelector = $('#equipment-reason');

    //Momentjs date handler
    //Sets the date for the new tickets to now; SAVE BUTTON SHOULD SAVE WITH HOUR
    $('#new-ticket-date-now').val(moment().format("dddd, D MMMM 'YY, h:mm a"));
    
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
        var numeroFolio = $('#numero-folio');
        if (this.value == 'Avanta') {
            numeroFolio.val('A');
        } else if (this.value == 'Brisas') {
            numeroFolio.val('B');
        } else if (this.value == 'Sienna') {
            numeroFolio.val('S');
        }
        //SHOULD CALL A FUNCTION TO CHECK THE LATEST TICKET, AND CREATE A CONSECUTIVE ONE
        //IT SHOULD THEN UNHIDE THE 'DATOS DEL CLIENTE' CONTAINER
        //ONCE THE 'DATOS DEL CLIENTE' CONTAINER IS FILLED, UNHIDE DATOS DEL EQUIPO
    });



});