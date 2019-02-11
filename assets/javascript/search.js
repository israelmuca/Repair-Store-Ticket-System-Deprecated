$(document).ready(function (){
    /*

        TODO:
            - Add pwd field
            - Add 'transferencia' to payment options
            - Add reprint of ticket
            - Add a closing ticket
            - Reapertura por garantía
            
            - Let the user come back after 1st print of ticket (for if there's an error)
            - Add a selling ticket that can or cannot be added to a specific customer
            - prepare weekly report
            - add a search option of non closed tickets
            - add a task panel for technicians to know what they need to work on
            - add user's job for filtering of options
            - Add signature field for ticket
            - Analyse a way to add smaller payments
            - Analyse a way to create a little quotes app
            - Export to PDF
            - HTML to be sent for email
            - Automailer API
            - Notify the user when it's important to know something happened
            - Add direct selling option (https://css-tricks.com/html-invoice/)
            - API for equipment data

    */
// --------------------- ON LOAD EVENTS - START ---------------------
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

    //Verify if the user has logged in
    checkLoginStatus();

    var ticketsRef = database.ref('/tickets');
    var customersRef = database.ref('customers/');

    $('.minimize-search-tickets').hide();

    //Fills the recent-tickets-table
    fillRecentTickets();
// --------------------- ON LOAD EVENTS -   END ---------------------
//-----------------
// --------------------- GLOBAL VARIABLES - START ---------------------
    //Global variables
    //Hide/unhide booleans
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var minimizeSearchTickets = true;
    var minimizeRecentTickets = false;

    var hideSearchTicketsContainer = false;
    var hideRecentTicketsContainer = false;
    var hideSelectedTicketContainer = true;

    var hidePaymentSection = true;
    var hideDeliverSection = true;

    var ticketDBID;
    var custDBID;
    var ticketInternalNotesCounter;


    //Arrays for notes
    var radioOptions = [
        ' Nota interna',
        ' Diagnóstico',
        ' Cotización',
        ' Comunicación con cliente'
    ];

    var radioIDs = [
        'nota',
        'diagnostico',
        'cotizacion',
        'comunicacion'
    ];

    //Global selectors
    //buttons
    var addNewNoteButton = $('#add-new-note-button');
    var saveNewNoteButton = $('#save-new-note-button');
    var searchNumberButton = $('#search-number-button');
    var searchTicketButton = $('#search-ticket-button');
    var reloadButton = $('#reload-button');
    reloadButton.hide();
    var paymentButtons = $('.payment-section-buttons');
    var paymentCompletedSaveButton = $('#payment-completed-save-button');
    var paymentCompletedCancelButton = $('#payment-completed-cancel-button');
    var deliverButtons = $('.deliver-section-buttons');
    var deliverCompletedSaveButton = $('#deliver-completed-save-button');
    var deliverCompletedCancelButton = $('#deliver-completed-cancel-button');

    //containers
    var selectedTicketContainer = $('#selected-ticket-container');
    selectedTicketContainer.hide();

    var searchTicketsContainer = $('#search-tickets-container');
    var recentTicketsContainer = $('#recent-tickets-container');

    //Information fields (inputs, checks, etc...)

    var searchText = $('#search-text');

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
    var ticketCreatedBySelector =$('#user-name-ticket');
    var dateSelector = $('#ticket-date');

    var eqTypeSelector = $('#equipment-type');
    var eqBrandSelector = $('#equipment-brand');
    var eqModelSelector = $('#equipment-model');
    var eqSerialNumSelector = $('#equipment-serial-number');
    var characteristicsSelector = $('#equipment-characteristics');
    var accesoriesSelector = $('#equipment-accesories');
    var reasonToVisitSelector = $('#equipment-reason');

    var paymentSectionSelector = $('.payment-section');
    paymentSectionSelector.hide();
    var deliverSectionSelector = $('.deliver-section');
    deliverSectionSelector.hide();
    var totalPaymentSelector = $('#total-payment');
    var paymentCompletedCheckboxSelector = $('#payment-completed-checkbox');
    var paymentCompletedDateSelector = $('#payment-completed-date');
    var paymentMethodSelector = $('#payment-method');
    var deliverCompletedCheckboxSelector = $('#deliver-completed-checkbox');
    var deliverCompletedDateSelector = $('#deliver-completed-date');
    var ticketClosedCheckboxSelector = $('#ticket-closed-checkbox');
    var ticketClosedDateSelector = $('#ticket-closed-date');

    var notesContainer = $('#created-ticket-notes-container');
    
// --------------------- GLOBAL VARIABLES -   END ---------------------
//-----------------
// --------------------- EVENT LISTENERS - START ---------------------

    //Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-search-tickets-click').on('click', minSearchTickets);
    $('.minimize-recent-tickets-click').on('click', minRecentTickets);
    $('.minimize-cust-data-click').on('click', minCustData);
    $('.minimize-equipment-data-click').on('click', minEquipData);

    //Click listeners for the search buttons
    searchNumberButton.on('click', searchNumber);
    searchTicketButton.on('click', searchTicket);

    //onHover listener for the recent tickets container, to show that they're links to the actual tickets
    $('#table-body').hover(function(){
        $('#table-body').css('cursor', 'pointer');
    });

    //onClick listener for creating the ticket container, to view and modify the clicked ticket
    $('#table-body').on('click', '.ticket', function() {
        ticketDBID = this.dataset.ticketDbid;
        custDBID = this.dataset.ticketCustdbid;

        displayTicket(ticketDBID, custDBID);
    });


    //Button click listener for add new note inside made tickets
    addNewNoteButton.on('click', addNewNoteInTicket);

    //Click listener for save-new-note button
    saveNewNoteButton.on('click', saveNewNoteInTicket);

    //Click listener for payment checkbox
    paymentCompletedCheckboxSelector.on('change', paymentDone);

    //.change() event listener for the number in the payment field
    totalPaymentSelector.on('change', formatToMXN);

    //Click listener for the save payment button
    paymentCompletedSaveButton.on('click', savePayment);

    //Click listener for the cancel payment button
    paymentCompletedCancelButton.on('click', cancelPayment);

    //Click listener for deliver checkbox
    deliverCompletedCheckboxSelector.on('change', deliverDone)

    //Click listener for the save deliver button
    deliverCompletedSaveButton.on('click', saveDeliver);

    //Click listener for the cancel deliver button
    deliverCompletedCancelButton.on('click', cancelDeliver);

    //Click listener for logout button
    $('#log-out-button').on('click', function(){
        firebase.auth().signOut();
    });


    // --------------------- EVENT LISTENERS - END ---------------------


    // --------------------- FUNCTIONS - START ---------------------

    //Verify the user's login status
    function checkLoginStatus() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                //Take the user to the login page
                window.location.href = 'login.html';
            } else {
                //validate user is auth
                isUserAuth(user.uid);
            }
        });
    }

    //Check if user is authorized to actually use the system
    function isUserAuth(pUserUid) {
        //Query the DB
        database.ref('users')
        .orderByChild('uid')
        .equalTo(pUserUid)
        .once('value')
        .then(function(snapshot) {
            if(snapshot.val()) {
                //User exists, save the user name and continue
                snapshot.forEach(function(userSnapshot){
                    userName = userSnapshot.val().name;
                    $('#user-name-log-out').text(userName);
                })
            } else {
                //User not authorized, tell them, then take them to the login

                //Modify the texts in the modal
                $('.modal-card-title').text('¡Usuario no autorizado!');
                $('.modal-card-body').html('<p>Asegúrate de hacer login con el usuario que te fue proporcionado</p>');

                //Activate the modal
                $('.modal').addClass('is-active');

                setTimeout(function(){
                    window.location.href = 'login.html';
                }, 5000);
            }
        })
    }

    ////Fills the recent-tickets-table
    function fillRecentTickets() {
        //Show last 15 tickets from DB
        // database.ref('/tickets')
        // .orderByChild('descOrder')
        // //.limitToFirst(200)
        // .on("child_added", function(ticketsSnapshot) {

        //     var oneTicketChild = ticketsSnapshot.val();
        //     createRowWithTicket(oneTicketChild, 'append')

        // })

        //For use with reports
        database.ref('/tickets')
        .orderByChild('paymentCompleted')
        .on("child_added", function(ticketsSnapshot) {

            var oneTicketChild = ticketsSnapshot.val();
            createRowWithTicketReport(oneTicketChild, 'append');

        })
    }

    //Delegate the row building here, to make sure other functions do only their main purpose
    function createRowWithTicket(pOneTicketData, pOrder) {

        var tableBody = $("#table-body");
        var mainRow = $("#table-body-main-row");
        var newRow = $("<tr>");
        newRow.attr('data-ticket-DBID', pOneTicketData.ticketID);
        newRow.attr('data-ticket-custDBID', pOneTicketData.custID);
        newRow.addClass('ticket');

        var tdTicketNum = $("<td>");
        tdTicketNum.text(pOneTicketData.fullTicketNum);
        newRow.append(tdTicketNum);

        var tdTicketDate= $("<td>");
        var sliceDate = pOneTicketData.date;
        tdTicketDate.text(sliceDate.slice(0, sliceDate.lastIndexOf(" '")));
        newRow.append(tdTicketDate);

        var fulloneCustomerName = pOneTicketData.custName + ' ' + (pOneTicketData.custLastName).slice(0,1) + '.';
        var tdCustName = $("<td>");
        tdCustName.text(fulloneCustomerName);
        newRow.append(tdCustName);

        var tdEqType = $("<td>");
        tdEqType.text(pOneTicketData.eqType);
        newRow.append(tdEqType);

        var tdEqBrand = $("<td>");
        tdEqBrand.text(pOneTicketData.eqBrand);
        newRow.append(tdEqBrand);

        var tdEqModel = $("<td>");
        tdEqModel.text(pOneTicketData.eqModel);
        newRow.append(tdEqModel);

        var tdTicketCompleted = $("<td>");
        if (pOneTicketData.deliverCompleted && pOneTicketData.paymentCompleted) {
            tdTicketCompleted.text('Sí');
        } else {
            tdTicketCompleted.text('No');
        }
        newRow.append(tdTicketCompleted);

        var tdNotes = $("<td>");
        tdNotes.text(pOneTicketData.internalNotesCounter-1);
        newRow.append(tdNotes);

        //Finally, append or prepend the whole row to the tablebody
        if (pOrder == 'prepend') {
            tableBody.prepend(newRow);
        } else if (pOrder == 'append') {
            tableBody.append(newRow);
        }
        
    }

    //Delegate the row building here, to make sure other functions do only their main purpose
    function createRowWithTicketReport(pOneTicketData, pOrder) {

        //Activate for when I only want to see laptops
        if(pOneTicketData.eqType != "Laptop") {
            return;
        }

        //Activate for when I only want to see equipments that have been paid for
        if(!pOneTicketData.paymentCompleted) {
            return;
        }

        //Activate for when I only want to see equipments paid for with Card (debit or credit)
        // if(pOneTicketData.paymentMethod.indexOf("Tarjeta") == -1) {
        //     return;
        // }

        var tableBody = $("#table-body");
        var mainRow = $("#table-body-main-row");
        var newRow = $("<tr>");
        newRow.attr('data-ticket-DBID', pOneTicketData.ticketID);
        newRow.attr('data-ticket-custDBID', pOneTicketData.custID);
        newRow.addClass('ticket');

        var tdTicketNum = $("<td>");
        tdTicketNum.text(pOneTicketData.fullTicketNum);
        newRow.append(tdTicketNum);

        var tdTicketDate= $("<td>");
        var sliceDate = pOneTicketData.date;
        tdTicketDate.text(sliceDate.slice(0, sliceDate.lastIndexOf(" '")));
        newRow.append(tdTicketDate);

        var fulloneCustomerName = pOneTicketData.custName + ' ' + (pOneTicketData.custLastName).slice(0,1) + '.';
        var tdCustName = $("<td>");
        tdCustName.text(fulloneCustomerName);
        newRow.append(tdCustName);

        var tdEqType = $("<td>");
        tdEqType.text(pOneTicketData.eqType);
        newRow.append(tdEqType);

        var tdEqBrand = $("<td>");
        tdEqBrand.text(pOneTicketData.paymentMethod);
        newRow.append(tdEqBrand);

        var tdEqModel = $("<td>");
        tdEqModel.text(pOneTicketData.paymentTotal);
        newRow.append(tdEqModel);

        var tdTicketCompleted = $("<td>");
        if (pOneTicketData.deliverCompleted && pOneTicketData.paymentCompleted) {
            tdTicketCompleted.text(pOneTicketData.paymentDate);
        } else {
            tdTicketCompleted.text(pOneTicketData.paymentDate);
        }
        newRow.append(tdTicketCompleted);

        var tdNotes = $("<td>");
        tdNotes.text(pOneTicketData.internalNotesCounter-1);
        newRow.append(tdNotes);

        //Finally, append or prepend the whole row to the tablebody
        if (pOrder == 'prepend') {
            tableBody.prepend(newRow);
        } else if (pOrder == 'append') {
            tableBody.append(newRow);
        }
        
    }

    //Search the DB for the phone number
    function searchNumber() {
        searchNumberButton.addClass('is-loading');
        var phoneNumberSearch = $('#search-number-input').val().trim();
        searchTicketsContainer.hide(900);
        reloadButton.show();

        database.ref('customers')
        .orderByChild('cellNum')
        .equalTo(phoneNumberSearch)
        .once('value')
        .then(function(snapshot) {
            if(snapshot.val()) {
                //Customer exists in DB
                //Clear table
                $("#table-body").empty();
                snapshot.forEach(function(snapshotChild) {
                    customerTickets = snapshotChild.val().tickets;
                    for (var key in customerTickets) {
                        ticketsRef
                        .child(key)
                        .once("value")
                        .then(function(oneTicketSnapshot) {
                            var oneTicketData = oneTicketSnapshot.val();
                            createRowWithTicket(oneTicketData, 'prepend');
                            searchText.text('15 folios más recientes de ' +oneTicketData.custName+ ' ' +oneTicketData.custLastName);
                        })    
                    }

                })
            } else {
                //Modify the texts in the modal
                $('.modal-card-title').text('¡Cliente no encontrado!');
                $('.modal-card-body').html('<p>Asegúrate de confirmar el número del cliente o de intentar con algún otro número</p>');

                //Activate the modal
                $('.modal').addClass('is-active');

                setTimeout(function(){ //FIXME: Shouldn't use this!
                    window.location.href = 'search.html';
                }, 3000);
            }
        });

    }

    //Search the DB for a ticket number
    function searchTicket() {
        searchTicketButton.addClass('is-loading');
        var ticketNumberSearch = ($('#search-ticket-input').val().trim()).toUpperCase();
        searchTicketsContainer.hide(900);
        reloadButton.show();

        ticketsRef
        .orderByChild('searchTicketNum')
        .equalTo(ticketNumberSearch)
        .once("value")
        .then(function(snapshot) {
            if(snapshot.val()) {
                //customer exists in DB
                snapshot.forEach(function(snapshotChild) {
                    ticketDBID = snapshotChild.val().ticketID;
                    custDBID = snapshotChild.val().custID;
                    displayTicket(ticketDBID, custDBID);
                })
            } else {
                //Modify the texts in the modal
                $('.modal-card-title').text('¡Folio no encontrado!');
                $('.modal-card-body').html('<p>Recuerda que los números a usar para la búsqueda son la 1er letra de la sucursal seguido del número del folio, por ej: "A42".</p>');

                //Activate the modal
                $('.modal').addClass('is-active');

                setTimeout(function(){ //FIXME: Shouldn't use this!
                    window.location.href = 'search.html';
                }, 3000);
            }
        })

    }

    //Display individually selected ticket
    function displayTicket(pTicketDBID, pCustDBID) {
        
        searchTicketsContainer.hide();

        //Function variables
        var selectedTicketData;
        var selectedCustID;
        var selectedCustData;

        //Hide the recent-tickets-container and change the variable
        recentTicketsContainer.hide();
        hideRecentTicketsContainer = true;
        //Show the selected-ticket-container
        selectedTicketContainer.show();
        hideSelectedTicketContainer = false;

        //Hide the save-note-button until there's something to save (add-note)
        saveNewNoteButton.hide();

        //Change the menu to show "results" as active and create a link in the menu back to search
        $('#search-tickets-list').removeClass('is-active');
        $('#search-tickets-list>a').attr('href', 'search.html')
        $('#results-tickets-list').addClass('is-active');

        //Get the customer data from firebase
        customersRef
        .child(pCustDBID)
        .once("value")
        .then(function(sCustSnapshot) { 
            selectedCustData = sCustSnapshot.val();
            
            custNameSelector.val(selectedCustData.custName);
            custLastNameSelector.val(selectedCustData.custLastName);
            cellNumSelector.val(selectedCustData.cellNum);
            emailSelector.val(selectedCustData.email);
            zipCodeSelector.val(selectedCustData.zipCode);
            if (selectedCustData.contactMethods.whats) {
                contactMetWhatsSelector.prop('checked', true);
            } else {
                contactMetWhatsSelector.prop('checked', false);
            }
            if (selectedCustData.contactMethods.call) {
                contactMetCallSelector.prop('checked', true);
            } else {
                contactMetCallSelector.prop('checked', false);
            }
            if (selectedCustData.contactMethods.email) {
                contactMetEmailSelector.prop('checked', true);
            } else {
                contactMetEmailSelector.prop('checked', false);
            }

        })

        //Get the ticket data from firebase
        ticketsRef
        .child(pTicketDBID)
        .once("value")
        .then(function(sTicketSnapshot) {
            selectedTicketData = sTicketSnapshot.val();

            //Populate the selected-ticket-container with the data from the ticket
            locationSelector.val(selectedTicketData.location);
            ticketNumSelector.val(selectedTicketData.fullTicketNum);
            ticketCreatedBySelector.val(selectedTicketData.ticketCreatedBy);
            dateSelector.val(selectedTicketData.date);

            eqTypeSelector.val(selectedTicketData.eqType);
            eqBrandSelector.val(selectedTicketData.eqBrand);
            eqModelSelector.val(selectedTicketData.eqModel);
            eqSerialNumSelector.val(selectedTicketData.eqSerialNum);
            characteristicsSelector.val(selectedTicketData.characteristics);
            accesoriesSelector.val(selectedTicketData.accesories);
            reasonToVisitSelector.val(selectedTicketData.reasonToVisit);

            //handle internalNotes data
            ticketInternalNotesCounter = selectedTicketData.internalNotesCounter;

            //loop to create 
            for (var key in selectedTicketData.notes) {
                var note = selectedTicketData.notes[key];
                createNotesInTicket(note);
            }

            //Ticket closing info

            if(selectedTicketData.paymentCompleted) {
                //show the section, hide the buttons
                paymentSectionSelector.show();
                paymentButtons.hide();

                //put the data in the fields
                paymentCompletedCheckboxSelector.prop('checked', true);
                $('#user-name-payment').val(selectedTicketData.paymentUserBy);
                totalPaymentSelector.val(selectedTicketData.paymentTotal);
                formatToMXN();
                paymentMethodSelector.val(selectedTicketData.paymentMethod);
                paymentCompletedDateSelector.val(selectedTicketData.paymentDate);

                //disable the fields
                paymentCompletedCheckboxSelector.prop('disabled', true);
                totalPaymentSelector.prop('disabled', true);
                paymentMethodSelector.prop('disabled', true);
            }

            if(selectedTicketData.deliverCompleted) {
                //show the section, hide the buttons
                deliverSectionSelector.show();
                deliverButtons.hide();

                //put the data in the fields
                deliverCompletedCheckboxSelector.prop('checked', true);
                $('#user-name-deliver').val(selectedTicketData.deliverUserBy);


                deliverCompletedDateSelector.val(selectedTicketData.deliverDate);

                //disable the field
                deliverCompletedCheckboxSelector.prop('disabled', true);
            }

        })

        //add the 'disabled' prop to the ticket fields
        locationSelector.prop('disabled', true);
        ticketNumSelector.prop('disabled', true);
        dateSelector.prop('disabled', true);
        //add the 'disabled' prop to customer fields
        cellNumSelector.prop('disabled', true);
        emailSelector.prop('disabled', true);
        custNameSelector.prop('disabled', true);
        custLastNameSelector.prop('disabled', true);
        zipCodeSelector.prop('disabled', true);
        contactMetWhatsSelector.prop('disabled', true);
        contactMetCallSelector.prop('disabled', true);
        contactMetEmailSelector.prop('disabled', true);
        //add the 'disabled' prop to the equpment fields
        eqTypeSelector.prop('disabled', true);
        eqBrandSelector.prop('disabled', true);
        eqModelSelector.prop('disabled', true);
        eqSerialNumSelector.prop('disabled', true);
        characteristicsSelector.prop('disabled', true);
        accesoriesSelector.prop('disabled', true);
        reasonToVisitSelector.prop('disabled', true);

    }

    function createNotesInTicket(pNote) {

        //Save all the values to vars
        var noteInternalNotesCounter = pNote.internalNotesCounter;
        var noteBy = pNote.noteBy
        var noteDate = pNote.noteDate;
        var noteID = pNote.noteID;
        var noteType = pNote.noteType;
        var noteMessage = pNote.noteText;

        //Create columns container for column TicketType and Date
        var columnsNoteTypeDate = $('<div>');
        columnsNoteTypeDate.addClass('columns');

        //Create column for the Ticket Type radio buttons
        var columnNoteType = $('<div>');
        columnNoteType.addClass('column');
        columnsNoteTypeDate.append(columnNoteType);

        var fieldNoteType = $('<div>');
        fieldNoteType.addClass('field');
        columnNoteType.append(fieldNoteType);

        var labelNoteType = $('<label>');
        labelNoteType.addClass('label');
        labelNoteType.text('Tipo de Nota:');
        fieldNoteType.append(labelNoteType);

        var controlNoteType = $('<div>');
        controlNoteType.addClass('control');
        fieldNoteType.append(controlNoteType);

        var toCheckId;
        for(var i=0; i < radioOptions.length; i++) {
            var labelRadio = $('<label>');
            labelRadio.addClass('radio');

            var inputRadio = $('<input>');
            inputRadio.attr('type', 'radio');
            inputRadio.attr('name', 'note-type-' + noteInternalNotesCounter);
            inputRadio.attr('id', radioIDs[i]+ '-' + noteInternalNotesCounter);
            //check if it's supposed to be checked
            if (noteType == radioIDs[i]) {
                //Create the correct ID of the radio to check
                toCheckId = '#' + radioIDs[i] + '-' + noteInternalNotesCounter;
            }
            inputRadio.prop('disabled', true);
            labelRadio.append(inputRadio);

            var labelRadioText = radioOptions[i];
            labelRadio.append(labelRadioText);

            controlNoteType.append(labelRadio);
        }

        //Create the 'created by' field next to the radios
        var columnBy = $('<div>');
        columnBy.addClass('column');
        columnBy.addClass('is-2');
        columnsNoteTypeDate.append(columnBy);
        var fieldBy = $('<div>');
        fieldBy.addClass('field');
        columnBy.append(fieldBy);
        var labelBy = $('<label>');
        labelBy.addClass('label');
        labelBy.text('Creada por');
        fieldBy.append(labelBy);

        var controlBy = $('<div>');
        controlBy.addClass('control');
        fieldBy.append(controlBy);

        //Create the textarea with incremental ID to save the created by to the DB
        var inputAreaBy = $('<input>');
        inputAreaBy.addClass('input');
        inputAreaBy.attr('type', 'text');
        inputAreaBy.attr('id', 'created-by-' + noteInternalNotesCounter);
        inputAreaBy.val(noteBy);
        inputAreaBy.prop('disabled', true);
        controlBy.append(inputAreaBy)


        //Create the date and place it on the right side
        var columnDate = $('<div>');
        columnDate.addClass('column');
        columnDate.addClass('is-one-quarter');
        columnsNoteTypeDate.append(columnDate);
        var fieldDate = $('<div>');
        fieldDate.addClass('field');
        columnDate.append(fieldDate);
        var labelDate = $('<label>');
        labelDate.addClass('label');
        labelDate.text('Fecha');
        fieldDate.append(labelDate);

        var controlDate = $('<div>');
        controlDate.addClass('control');
        fieldDate.append(controlDate);

        //Create the textarea with an incremental ID to save the date to the BD
        var inputAreaDate = $('<input>');
        inputAreaDate.addClass('input');
        inputAreaDate.attr('type', 'text');
        inputAreaDate.attr('id', 'new-ticket-date-' + noteInternalNotesCounter);
        inputAreaDate.val(noteDate);
        inputAreaDate.prop('disabled', true);
        controlDate.append(inputAreaDate);

        //Append this columns to the container
        notesContainer.append(columnsNoteTypeDate);

        //Create columns and column for the actual ticket
        var columnsTicket = $('<div>');
        columnsTicket.addClass('columns');
        var columnTicket = $('<div>');
        columnTicket.addClass('column');
        columnsTicket.append(columnTicket);

        //Create the form input
        var fieldTicket = $('<div>');
        fieldTicket.addClass('field');
        columnTicket.append(fieldTicket);

        var controlTicket = $('<div>');
        controlTicket.addClass('control');
        fieldTicket.append(controlTicket);

        //Create the textarea with an incremental ID to save them all to the DB
        var textareaTicket = $('<textarea>');
        textareaTicket.addClass('textarea');
        textareaTicket.attr('id', 'ticket-text-' + noteInternalNotesCounter);
        textareaTicket.val(noteMessage);
        textareaTicket.prop('disabled', true);
        controlTicket.append(textareaTicket);

        //Apend this columns to the container
        notesContainer.append(columnsTicket);

        //At the end, click on the proper radio button, and disable them
        $(toCheckId).prop('checked', true);
    }

    function addNewNoteInTicket() {
        //Hide and show buttons
        addNewNoteButton.hide();
        saveNewNoteButton.show();

        //Create columns container for column TicketType and Date
        var columnsNoteTypeDate = $('<div>');
        columnsNoteTypeDate.addClass('columns');

        //Create column for the Ticket Type radio buttons
        var columnNoteType = $('<div>');
        columnNoteType.addClass('column');
        columnsNoteTypeDate.append(columnNoteType);

        var fieldNoteType = $('<div>');
        fieldNoteType.addClass('field');
        columnNoteType.append(fieldNoteType);

        var labelNoteType = $('<label>');
        labelNoteType.addClass('label');
        labelNoteType.text('Tipo de Nota:');
        fieldNoteType.append(labelNoteType);

        var controlNoteType = $('<div>');
        controlNoteType.addClass('control');
        fieldNoteType.append(controlNoteType);

        for(var i=0; i < radioOptions.length; i++) {
            var labelRadio = $('<label>');
            labelRadio.addClass('radio');
            
            var inputRadio = $('<input>');
            inputRadio.attr('type', 'radio');
            inputRadio.attr('name', 'note-type-' + ticketInternalNotesCounter);
            inputRadio.attr('id', radioIDs[i]+ '-' + ticketInternalNotesCounter);
            labelRadio.append(inputRadio);

            var labelRadioText = radioOptions[i];
            labelRadio.append(labelRadioText);

            controlNoteType.append(labelRadio);
        }

        //Create the 'created by' field next to the radios
        var columnBy = $('<div>');
        columnBy.addClass('column');
        columnBy.addClass('is-2');
        columnsNoteTypeDate.append(columnBy);
        var fieldBy = $('<div>');
        fieldBy.addClass('field');
        columnBy.append(fieldBy);
        var labelBy = $('<label>');
        labelBy.addClass('label');
        labelBy.text('Creada por');
        fieldBy.append(labelBy);

        var controlBy = $('<div>');
        controlBy.addClass('control');
        fieldBy.append(controlBy);

        //Create the textarea with incremental ID to save the created by to the DB
        var inputAreaBy = $('<input>');
        inputAreaBy.addClass('input');
        inputAreaBy.attr('type', 'text');
        inputAreaBy.attr('id', 'created-by-' + ticketInternalNotesCounter);
        inputAreaBy.val(userName);
        inputAreaBy.prop('disabled', true);
        controlBy.append(inputAreaBy)

        //Create the date and place it on the right side
        var columnDate = $('<div>');
        columnDate.addClass('column');
        columnDate.addClass('is-one-quarter');
        columnsNoteTypeDate.append(columnDate);
        var fieldDate = $('<div>');
        fieldDate.addClass('field');
        columnDate.append(fieldDate);
        var labelDate = $('<label>');
        labelDate.addClass('label');
        labelDate.text('Fecha');
        fieldDate.append(labelDate);

        var controlDate = $('<div>');
        controlDate.addClass('control');
        fieldDate.append(controlDate);

        //Create the textarea with an incremental ID to save the date to the BD
        var inputAreaDate = $('<input>');
        inputAreaDate.addClass('input');
        inputAreaDate.attr('type', 'text');
        inputAreaDate.attr('id', 'new-ticket-date-' + ticketInternalNotesCounter);
        inputAreaDate.val(moment().format("dddd, D MMMM 'YY, h:mm a"));
        inputAreaDate.prop('disabled', true);
        controlDate.append(inputAreaDate);

        //Append this columns to the container
        notesContainer.append(columnsNoteTypeDate);

        //Create columns and column for the actual ticket
        var columnsTicket = $('<div>');
        columnsTicket.addClass('columns');
        var columnTicket = $('<div>');
        columnTicket.addClass('column');
        columnsTicket.append(columnTicket);

        //Create the form input
        var fieldTicket = $('<div>');
        fieldTicket.addClass('field');
        columnTicket.append(fieldTicket);

        var controlTicket = $('<div>');
        controlTicket.addClass('control');
        fieldTicket.append(controlTicket);
        

        //Create the textarea with an incremental ID to save them all to the DB
        var textareaTicket = $('<textarea>');
        textareaTicket.addClass('textarea');
        textareaTicket.attr('placeholder',
            'Cualquier interacción con el equipo o cliente debe de ser registrada aquí SIN EXCEPCIÓN.\r\n' 
            + 'Recuerda ser lo más claro y explícito posible, preferible de más, no de menos.\r\n'
            + 'Si envias archivos a cliente, debes poner enlaces a Google Drive con los archivos enviados.');
        textareaTicket.attr('id', 'ticket-text-' + ticketInternalNotesCounter);
        controlTicket.append(textareaTicket);

        //Apend this columns to the container
        notesContainer.append(columnsTicket);

    }

    //Add individual note to tickets
    function saveNewNoteInTicket() {
        
        //Confirm a radio is selected
        if(!($('input[name="note-type-' + ticketInternalNotesCounter + '"]:checked')[0])) {
            $('#error-text-note').removeClass('is-invisible');
            return;
        }
        $('#error-text-note').addClass('is-invisible');

        //Get the values
        //Remove the '-x' before we can save it to the DB
        var newNoteTypeWithNumber = $('input[name="note-type-' + ticketInternalNotesCounter + '"]:checked')[0].id;
        var newNoteType = newNoteTypeWithNumber.slice(0, newNoteTypeWithNumber.lastIndexOf('-'));
        var newNoteBy = userName;
        var newNoteDate = $('#new-ticket-date-' + ticketInternalNotesCounter).val();
        var newNoteText = $('#ticket-text-' + ticketInternalNotesCounter).val();

        //Confirm text is written
        if (!newNoteText) {
            $('#error-text-note').removeClass('is-invisible');
            return;
        }
        $('#error-text-note').addClass('is-invisible');

        //Disable the fields once validation is done
        $('#new-ticket-date-' + ticketInternalNotesCounter).prop('disabled', true);
        $('#ticket-text-' + ticketInternalNotesCounter).prop('disabled', true);
        for(var i=0; i < radioOptions.length; i++) { //Disable all radios
            $('#' + radioIDs[i]+ '-' + ticketInternalNotesCounter).prop('disabled', true);
        }


        var newNoteID = ticketsRef.child(ticketDBID + '/notes').push().key;
        database.ref('/tickets/' + ticketDBID + '/notes')
        .child(newNoteID)
        .set({
            noteType: newNoteType,
            noteDate: newNoteDate,
            noteText: newNoteText,
            noteBy: newNoteBy,
            noteID: newNoteID,
            internalNotesCounter: ticketInternalNotesCounter
        })
        .then(function() {
            ticketInternalNotesCounter++;

            //save the internalNotesCounter on the ticket
            database.ref('/tickets')
            .child(ticketDBID)
            .update({
                internalNotesCounter: ticketInternalNotesCounter
            })
        })

        //Reenable the button to create a new note
        addNewNoteButton.show();
        saveNewNoteButton.hide();

    }

    function paymentDone() {
        if (hidePaymentSection) {
            paymentSectionSelector.show();
            hidePaymentSection = false;
            paymentCompletedDateSelector.val(moment().format("dddd, D MMMM 'YY, h:mm a"));
            $('#user-name-payment').val(userName);
        } else {
            paymentSectionSelector.hide();
            hidePaymentSection = true;
            $('#error-text-payment').addClass('is-invisible');
        }
    }

    function savePayment() {

        var paymentUserBy = userName;
        var paymentTotal = numeral(totalPaymentSelector.val())._value; //Make the payment total a number w/o format
        var paymentMethod = paymentMethodSelector.val();
        var paymentDate = paymentCompletedDateSelector.val();
        var paymentTimestamp = firebase.database.ServerValue.TIMESTAMP;

        if (!paymentTotal || !paymentMethod) {
            $('#error-text-payment').removeClass('is-invisible');
            return;
        }
        $('#error-text-payment').addClass('is-invisible');


        ticketsRef
        .child(ticketDBID)
        .update({
            paymentCompleted: true,
            paymentUserBy: paymentUserBy,
            paymentTotal: paymentTotal,
            paymentMethod: paymentMethod,
            paymentDate: paymentDate,
            paymentTimestamp: paymentTimestamp
        })
        .then(
            customersRef
            .child(custDBID + '/tickets/' + ticketDBID)
            .update({
                paymentCompleted: true,
                paymentUserBy: paymentUserBy,
                paymentTotal: paymentTotal,
                paymentMethod: paymentMethod,
                paymentDate: paymentDate,
                paymentTimestamp: paymentTimestamp
        }))
        .then(function(){
            paymentButtons.hide();
            paymentCompletedCheckboxSelector.prop('disabled', true);
            totalPaymentSelector.prop('disabled', true);
            paymentMethodSelector.prop('disabled', true);
        })
        
    }

    function cancelPayment() {
        paymentSectionSelector.hide();
        hidePaymentSection = true;
        paymentCompletedCheckboxSelector.prop('checked', false);
        $('#error-text-payment').addClass('is-invisible');
    }

    function formatToMXN() {
        var currencyMXN = numeral(totalPaymentSelector.val()).format('0,0.00');
        totalPaymentSelector.val(currencyMXN);
    }

    function deliverDone() {
        if (hideDeliverSection) {
            deliverSectionSelector.show();
            hideDeliverSection = false;
            deliverCompletedDateSelector.val(moment().format("dddd, D MMMM 'YY, h:mm a"));
            $('#user-name-deliver').val(userName);
        } else {
            deliverSectionSelector.hide();
            hideDeliverSection = true;
        }
    }

    function saveDeliver() {

        var deliverDate = deliverCompletedDateSelector.val();
        var deliverUserBy = userName;
        var deliverTimestamp = firebase.database.ServerValue.TIMESTAMP;

        ticketsRef
        .child(ticketDBID)
        .update({
            deliverCompleted: true,
            deliverUserBy: deliverUserBy,
            deliverDate: deliverDate,
            deliverTimestamp: deliverTimestamp
        })
        .then(
            customersRef
            .child(custDBID + '/tickets/' + ticketDBID)
            .update({
                deliverCompleted: true,
                deliverUserBy: deliverUserBy,
                deliverDate: deliverDate,
                deliverTimestamp: deliverTimestamp
        }))
        .then(function(){
            deliverButtons.hide();
            deliverCompletedCheckboxSelector.prop('disabled', true);
        })
    }

    function cancelDeliver() {
        deliverSectionSelector.hide();
        hideDeliverSection = true;
        deliverCompletedCheckboxSelector.prop('checked', false);
    }


    //Update individually selected ticket
    function updateTicket() {
        //is it really needed? maybe just add comments?
    }

    //Minimize Customer Data Container
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

    //Minimize Equipment Data Container
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

    //Minimize Recent Tickets Container
    function minRecentTickets() {
        if (!minimizeRecentTickets) {
            $('.minimize-recent-tickets').hide();
            $('#recent-tickets-svg').removeClass('fa-minus-circle');
            $('#recent-tickets-svg').addClass('fa-plus-circle');
            minimizeRecentTickets = true;
        } else {
            $('.minimize-recent-tickets').show();
            $('#recent-tickets-svg').removeClass('fa-plus-circle');
            $('#recent-tickets-svg').addClass('fa-minus-circle');
            minimizeRecentTickets = false;
        }
    }

    //Minimize Search Tickets Container
    function minSearchTickets() {
        if (!minimizeSearchTickets) {
            $('.minimize-search-tickets').hide();
            $('#search-tickets-svg').removeClass('fa-minus-circle');
            $('#search-tickets-svg').addClass('fa-plus-circle');
            minimizeSearchTickets = true;
        } else {
            $('.minimize-search-tickets').show();
            $('#search-tickets-svg').removeClass('fa-plus-circle');
            $('#search-tickets-svg').addClass('fa-minus-circle');
            minimizeSearchTickets = false;
        }
    }

    // --------------------- FUNCTIONS - END ---------------------
});