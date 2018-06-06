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

    //Global variables
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var minimizeRecentNotes = false;

    var hideRecentNotesContainer = false;
    var hideSelectedNoteContainer = true;

    var createdTicketAddNoteID = 1;
    var fullDatabase = firebase.database();

    //Global selectors
    var sucursalSelector = $('.sucursal-select');

    //Hide selected-note-container on load, to wait until a note is selected
    $('#selected-note-container').hide();

    //Show ALL tickets from DB
    fullDatabase.ref().on("child_added", function(snapshot) {

        var oneDatabaseChild = snapshot.val();
        //console.log(oneDatabaseChild); testing purposes

        var tableBody = $("#table-body");
        var newRow = $("<tr>");
        newRow.attr('data-note-uID', snapshot.ref.path.pieces_["0"]);
        newRow.addClass('note');
        tableBody.append(newRow);

        var tdLocation = $("<td>");
        tdLocation.text(oneDatabaseChild.location);
        newRow.append(tdLocation);

        var tdTicketNum = $("<td>");
        tdTicketNum.text(oneDatabaseChild.ticketNum);
        newRow.append(tdTicketNum);

        var tdCustName = $("<td>");
        tdCustName.text(oneDatabaseChild.custName);
        newRow.append(tdCustName);

        var tdCustLastName = $("<td>");
        tdCustLastName.text(oneDatabaseChild.custLastName);
        newRow.append(tdCustLastName);

        var tdEqBrand = $("<td>");
        tdEqBrand.text(oneDatabaseChild.eqBrand);
        newRow.append(tdEqBrand);

        var tdEqModel = $("<td>");
        tdEqModel.text(oneDatabaseChild.eqModel);
        newRow.append(tdEqModel);

        var tdNotes = $("<td>");
        if (oneDatabaseChild.notes) {
            tdNotes.text("Sí");
        } else {
            tdNotes.text("No");
        }
        newRow.append(tdNotes);

    });


    // --------------------- EVENT LISTENERS - START ---------------------

    //Click listeners for hiding containers as clicks are done on the respective boxes
    $('.minimize-recent-notes-click').on('click', function() {
        if (!minimizeRecentNotes) {
            $('.minimize-recent-notes').hide();
            minimizeRecentNotes = true;
        } else {
            $('.minimize-recent-notes').show();
            minimizeRecentNotes = false;
        }
    });
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

    //onHover listener for the recent notes container, to show that they're links to the actual notes
    $('#table-body').hover(function(){
        $('#table-body').css('cursor', 'pointer');
    });

    //onClick listener for creating the note container, to view and modify the clicked note
    $('#table-body').on('click', '.note', function() {
        var noteUID = this.dataset.noteUid;
        displayNote(noteUID);
    });

    //Onload creator of notes inside tickets, should get ticket # and add the note with an special ID linked to the ticket ID
    //Button click listener for new notes inside made tickets
    $('#add-new-note').on('click', function() {
        //Uses BULMA CSS styling to create the new notes to be added

        var notesContainer = $('#created-ticket-notes-container');
        var radioOptions = [
            ' Nota interna',
            ' Diagnóstico',
            ' Cotización',
            ' Comunicación con cliente',
            ' Entrega programada'
        ];

        //Create columns container for column NoteType and Date
        var columnsNoteTypeDate = $('<div>');
        columnsNoteTypeDate.addClass('columns');

        //Create column for the Note Type radio buttons
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
            inputRadio.attr('name', 'question-' + createdTicketAddNoteID);
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
        inputAreaDate.attr('id', 'new-note-date-' + createdTicketAddNoteID);
        inputAreaDate.val(moment().format("dddd, D MMMM 'YY, h:mm a"));
        controlDate.append(inputAreaDate);

        //Append this columns to the container
        notesContainer.append(columnsNoteTypeDate);

        //Create columns and column for the actual note
        var columnsNote = $('<div>');
        columnsNote.addClass('columns');
        var columnNote = $('<div>');
        columnNote.addClass('column');
        columnsNote.append(columnNote);

        //Create the form input
        var fieldNote = $('<div>');
        fieldNote.addClass('field');
        columnNote.append(fieldNote);

        var controlNote = $('<div>');
        controlNote.addClass('control');
        fieldNote.append(controlNote);
        

        //Create the textarea with an incremental ID to save them all to the DB
        var textareaNote = $('<textarea>');
        textareaNote.addClass('textarea');
        textareaNote.attr('placeholder',
            'Cualquier interacción con el equipo o cliente debe de ser registrada aquí SIN EXCEPCIÓN.\r\n' 
            + 'Recuerda ser lo más claro y explícito posible, preferible de más, no de menos.\r\n');
        textareaNote.attr('id', 'note-text-' + createdTicketAddNoteID);
        controlNote.append(textareaNote);

        //Apend this columns to the container
        notesContainer.append(columnsNote);

        //Once the ID # has been used, add 1 to it
        createdTicketAddNoteID++;

    });

    // --------------------- EVENT LISTENERS - END ---------------------


    // --------------------- FUNCTIONS - START ---------------------

    function displayNote(pNoteUID) {
        //Hide the recent-notes-container and change the variable
        $('#recent-notes-container').hide();
        hideRecentNotesContainer = true;

        //Change the menu to show "results" as active and create a link in the menu back to search
        $('#search-notes-list').removeClass('is-active');
        $('#search-notes-list>a').attr('href', 'search.html')
        $('#results-notes-list').addClass('is-active');

        //Get the note data from firebase

        /* Is bringing the correct note, but shows "accesories" only
        var selectedNoteData = fullDatabase.ref(pNoteUID).limitToFirst(1);
        selectedNoteData.on("value", function(data) {
        console.log(data.val());
        }, function (error) {
        console.log("Error: " + error.code);
        });
        */

        var selectedNoteData = fullDatabase.ref('notas/').limitToFirst(1);

        //var selectedNoteData = fullDatabase.ref();

        selectedNoteData.orderByChild("dateAdded").equalTo("1528310492484").on("child_added", function(data) {
            console.log(data);
        });

        fullDatabase.ref('-LELCYxY2bvHW4g0Jz_L').on("value", function(snapshot) {
            console.log(snapshot);
        });

        fullDatabase.ref().child('-LELCYxY2bvHW4g0Jz_L');

        //Populate the selected-note-container with the data from the note
        //Clear it first?



        //Show the selected-note-container
        $('#selected-note-container').show();
        hideSelectedNoteContainer = false;

    }

    // --------------------- FUNCTIONS - END ---------------------
});