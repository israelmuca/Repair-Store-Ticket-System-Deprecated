$(document).ready(function (){
    
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
});