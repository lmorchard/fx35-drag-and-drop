/**
 * Quick example of HTML5 Drag & Drop
 *
 * <div id="newschool">
 *     <h2>New school drag and drop</h2>
 *     <div class="dragme">Drag me!</div>
 *     <div class="drophere">Drop here!</div>
 * </div>
 */
$(document).ready(function() {

    // Set up the draggable element.
    $('#newschool .dragme')
        .attr('draggable', 'true')
        .bind('dragstart', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            dt.setData("Text", "Dropped in zone!");
            return true;
        });

    // Set up the drop zone.
    $('#newschool .drophere')

        // Update the drop zone class on drag enter/leave
        .bind('dragenter', function(ev) {
            $(ev.target).addClass('dragover');
            return false;
        })
        .bind('dragleave', function(ev) {
            $(ev.target).removeClass('dragover');
            return false;
        })

        // Allow drops of any kind into the zone.
        .bind('dragover', function(ev) {
            return false;
        })

        // Handle the final drop...
        .bind('drop', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            $.log('#newschool .messages', dt.getData("Text"));
            ev.stopPropagation();
            return false;
        });

});
