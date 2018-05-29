$(document).ready(function (){
    /*
    DEPRECATED THE ONE PAGE APP, USING SEVERAL PAGES NOW
    //Catch containers
    var createNoteContainer = $("#create-note-container");
    var searchNoteContainer = $("#search-notes-container");

    //Hide containers
    createNoteContainer.show();
    searchNoteContainer.hide();

    //Function to switch tabs
    $('.tabs li').on('click', function() {
        var tabClicked = $(this);
        
        if (tabClicked[0].id == "create-note-list") {
            tabClicked.addClass("is-active");
            $("#search-notes-list").removeClass("is-active");
            searchNoteContainer.hide();
            createNoteContainer.show();

        } else if (tabClicked[0].id == "search-notes-list") {
            tabClicked.addClass("is-active");
            $("#create-note-list").removeClass("is-active");
            createNoteContainer.hide();
            searchNoteContainer.show();
        }
    });
    */

    //Global variables
    var minimizeCustData = false;
    var minimizeEquipData = false;
    var minimizeRecentNotes = false;

    //Global selectors
    var sucursalSelector = $('.sucursal-select');

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
    $('.minimize-recent-notes-click').on('click', function() {
        if (!minimizeRecentNotes) {
            $('.minimize-recent-notes').hide();
            minimizeRecentNotes = true;
        } else {
            $('.minimize-recent-notes').show();
            minimizeRecentNotes = false;
        }
    });

    //Change listener to apply the 1st character of the ticket number
    sucursalSelector.on('change', function() {
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