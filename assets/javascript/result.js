$(document).ready(function (){

    //Global variables
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var createdTicketAddNoteID = 1; //should be reset to one every time a new note is opened (maybe its time for a specific JS for each HTML?)

    //Global selectors
    var sucursalSelector = $('.sucursal-select');
    
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

    //Onload creator of notes inside tickets, should get ticket # and add the note with an special ID linked to the ticket ID
    //Button click listener for new notes inside made tickets
    $('#add-new-note').on('click', function() {
        //Uses BULMA CSS styling to create the new notes to be added

        var notesContainer = $('#created-ticket-notes-container');

        //Create columns and column for the date
        var columnsDate = $('<div>');
        columnsDate.addClass('columns');
        var columnDateEmpty = $('<div>');
        columnDateEmpty.addClass('column');
        columnDateEmpty.addClass('is-two-thirds');
        columnsDate.append(columnDateEmpty);
        //Create the date and place it on the right side
        var columnDate = $('<div>');
        columnDate.addClass('column');
        columnsDate.append(columnDate);
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
        notesContainer.append(columnsDate);



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

        var labelNote = $('<label>');
        labelNote.addClass('label');
        labelNote.text('Diagnóstico/Comunicación con cliente/Comentarios internos');
        fieldNote.append(labelNote);
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
});