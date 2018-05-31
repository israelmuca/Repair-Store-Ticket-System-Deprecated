$(document).ready(function (){

    //Global variables
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var createdTicketAddNoteID = 1;

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
});