$(document).ready(function (){
    /*

        TODO:
                - Add search feature for ticket number and customer phone number
                - ADD SECURITY
                - ADD indexOf: rules to the DB
                - Create the simple HTML view for the tickets
                - Add the signature field
                - Export to PDF
                - HTML view for the mail to be sent
                - Automailer
                - Validate fields, most things shouldn't be valid if they're empty
                - Notify successfull writes to the DB so the user knows things happened

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

    var ticketsRef = database.ref('/tickets');
    var customersRef = database.ref('customers/');

    //Fills the recent-tickets-table
    fillRecentTickets();
// --------------------- ON LOAD EVENTS -   END ---------------------
//-----------------
// --------------------- GLOBAL VARIABLES - START ---------------------
    //Global variables
    //Hide/unhide booleans
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var minimizeRecentTickets = false;

    var hideRecentTicketsContainer = false;
    var hideSelectedTicketContainer = true;

    var ticketDBID;
    var custDBID;
    var ticketInternalNotesCounter;


    //Arrays for notes
    var radioOptions = [
        ' Nota interna',
        ' Diagnóstico',
        ' Cotización',
        ' Comunicación con cliente',
        ' Entrega programada'
    ];

    var radioIDs = [
        'nota',
        'diagnostico',
        'cotizacion',
        'comunicacion',
        'entrega'
    ];

    //Global selectors
    //buttons
    var addNewNoteButton = $('#add-new-note-button');
    var saveNewNoteButton = $('#save-new-note-button');

    //containers
    var selectedTicketContainer = $('#selected-ticket-container');
    selectedTicketContainer.hide();

    var searchTicketsContainer = $('#search-tickets-container');

    //Information fields (inputs, checks, etc...)
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
    var dateSelector = $('#ticket-date');

    var eqTypeSelector = $('#equipment-type');
    var eqBrandSelector = $('#equipment-brand');
    var eqModelSelector = $('#equipment-model');
    var eqSerialNumSelector = $('#equipment-serial-number');
    var characteristicsSelector = $('#equipment-characteristics');
    var accesoriesSelector = $('#equipment-accesories');
    var reasonToVisitSelector = $('#equipment-reason');

    var notesContainer = $('#created-ticket-notes-container');
    
// --------------------- GLOBAL VARIABLES -   END ---------------------
//-----------------
// --------------------- EVENT LISTENERS - START ---------------------

    //Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-search-tickets-click').on('click', minSearchTickets);
    $('.minimize-cust-data-click').on('click', minCustData);
    $('.minimize-equipment-data-click').on('click', minEquipData);

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

    // --------------------- EVENT LISTENERS - END ---------------------


    // --------------------- FUNCTIONS - START ---------------------

    ////Fills the recent-tickets-table
    function fillRecentTickets() {
        //Show last 15 tickets from DB
        database.ref('/tickets')
        .orderByChild('descOrder')
        .limitToLast(15)
        .on("child_added", function(ticketsSnapshot) {

            var oneTicketChild = ticketsSnapshot.val();

            var tableBody = $("#table-body");
            var newRow = $("<tr>");
            newRow.attr('data-ticket-DBID', ticketsSnapshot.ref.path.pieces_[1]);
            newRow.attr('data-ticket-custDBID', oneTicketChild.custID);
            newRow.addClass('ticket');
            tableBody.append(newRow);

            var tdTicketNum = $("<td>");
            tdTicketNum.text(oneTicketChild.fullTicketNum);
            newRow.append(tdTicketNum);

            var tdTicketDate= $("<td>");
            var sliceDate = oneTicketChild.date;
            tdTicketDate.text(sliceDate.slice(0,-5));
            newRow.append(tdTicketDate);

            var fulloneCustomerName = oneTicketChild.custName + ' ' + oneTicketChild.custLastName;
            var tdCustName = $("<td>");
            tdCustName.text(fulloneCustomerName);
            newRow.append(tdCustName);

            var tdEqBrand = $("<td>");
            tdEqBrand.text(oneTicketChild.eqBrand);
            newRow.append(tdEqBrand);

            var tdEqModel = $("<td>");
            tdEqModel.text(oneTicketChild.eqModel);
            newRow.append(tdEqModel);

            var tdNotes = $("<td>");
            tdNotes.text(ticketsSnapshot.child('notes').numChildren());
            newRow.append(tdNotes);

        })
    }

    //Display individually selected ticket
    function displayTicket(pTicketDBID, pCustDBID) {
        //Function variables
        var selectedTicketData;
        var selectedCustID;
        var selectedCustData;

        //Hide the search-tickets-container and change the variable
        searchTicketsContainer.hide();
        hideSearchTicketsContainer = true;
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
            + 'Recuerda ser lo más claro y explícito posible, preferible de más, no de menos.\r\n');
        textareaTicket.attr('id', 'ticket-text-' + ticketInternalNotesCounter);
        controlTicket.append(textareaTicket);

        //Apend this columns to the container
        notesContainer.append(columnsTicket);

    }

    //Add individual note to tickets
    function saveNewNoteInTicket() {

        //Disable the fields, then get their values
        //Remove the '-x' before we can save it to the DB
        for(var i=0; i < radioOptions.length; i++) { //Disable all radios
            $('#' + radioIDs[i]+ '-' + ticketInternalNotesCounter).prop('disabled', true);
        }
        var newNoteTypeWithNumber = $('input[name="note-type-' + ticketInternalNotesCounter + '"]:checked')[0].id;
        var newNoteType = newNoteTypeWithNumber.slice(0, newNoteTypeWithNumber.lastIndexOf('-'))

        $('#new-ticket-date-' + ticketInternalNotesCounter).prop('disabled', true);
        var newNoteDate = $('#new-ticket-date-' + ticketInternalNotesCounter).val();
        $('#ticket-text-' + ticketInternalNotesCounter).prop('disabled', true);
        var newNoteText = $('#ticket-text-' + ticketInternalNotesCounter).val();

        var newNoteID = ticketsRef.child(ticketDBID + '/notes').push().key;
        database.ref('/tickets/' + ticketDBID + '/notes')
        .child(newNoteID)
        .set({
            noteType: newNoteType,
            noteDate: newNoteDate,
            noteText: newNoteText,
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

    //Minimize Search Tickets Container
    function minSearchTickets() {
        if (!minimizeRecentTickets) {
            $('.minimize-search-tickets').hide();
            $('#search-tickets-svg').removeClass('fa-minus-circle');
            $('#search-tickets-svg').addClass('fa-plus-circle');
            minimizeRecentTickets = true;
        } else {
            $('.minimize-search-tickets').show();
            $('#search-tickets-svg').removeClass('fa-plus-circle');
            $('#search-tickets-svg').addClass('fa-minus-circle');
            minimizeRecentTickets = false;
        }
    }

    // --------------------- FUNCTIONS - END ---------------------
});