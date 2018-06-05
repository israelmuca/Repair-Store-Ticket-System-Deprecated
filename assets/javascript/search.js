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
    
    //Variables globales
    var minimizeRecentNotes = false;

    $('.minimize-recent-notes-click').on('click', function() {
        if (!minimizeRecentNotes) {
            $('.minimize-recent-notes').hide();
            minimizeRecentNotes = true;
        } else {
            $('.minimize-recent-notes').show();
            minimizeRecentNotes = false;
        }
    });

    database.ref().on("child_added", function(snapshot) {
        //Código para mostrar los tickets de la base de datos

        var currentDatabase = snapshot.val();
        console.log(currentDatabase); //testing purposes

        var tableBody = $("#table-body");
        var newRow = $("<tr>");
        tableBody.append(newRow);

        var tdLocation = $("<td>");
        tdLocation.text(currentDatabase.location);
        newRow.append(tdLocation);

        var tdTicketNum = $("<td>");
        tdTicketNum.text(currentDatabase.ticketNum);
        newRow.append(tdTicketNum);

        var tdCustName = $("<td>");
        tdCustName.text(currentDatabase.custName);
        newRow.append(tdCustName);

        var tdCustLastName = $("<td>");
        tdCustLastName.text(currentDatabase.custLastName);
        newRow.append(tdCustLastName);

        var tdEqBrand = $("<td>");
        tdEqBrand.text(currentDatabase.eqBrand);
        newRow.append(tdEqBrand);

        var tdEqModel = $("<td>");
        tdEqModel.text(currentDatabase.eqModel);
        newRow.append(tdEqModel);

        var tdNotes = $("<td>");
        tdNotes.text(currentDatabase.notes);
        newRow.append(tdNotes);

    });

});