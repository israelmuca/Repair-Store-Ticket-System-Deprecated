$(document).ready(function (){
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

});