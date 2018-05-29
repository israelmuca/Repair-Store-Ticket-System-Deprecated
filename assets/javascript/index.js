$(document).ready(function (){
    
    //Global variables
    var minimizeCustData = false;
    var minimizeEquipData = false;

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

    //Change listener to apply the 1st character of the new ticket number
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