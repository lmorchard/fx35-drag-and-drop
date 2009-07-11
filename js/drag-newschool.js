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

    $('#newschool .dragme')
    
        // Set the element as draggable.
        .attr('draggable', 'true')

        // Handle the start of dragging to initialize.
        .bind('dragstart', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            dt.setData("Text", "Dropped in zone!");
            return true;
        })

        // Handle the end of dragging.
        .bind('dragend', function(ev) {
            $.log('#newschool .messages', 'Drag ended');
            return false;
        });

    $('#newschool .drophere')

        // Highlight on drag entering drop zone.
        .bind('dragenter', function(ev) {
            $(ev.target).addClass('dragover');
            return false;
        })

        // Un-highlight on drag leaving drop zone.
        .bind('dragleave', function(ev) {
            $(ev.target).removeClass('dragover');
            return false;
        })

        // Decide whether the thing dragged in is welcome.
        .bind('dragover', function(ev) {
            return false;
        })

        // Handle the final drop...
        .bind('drop', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            console.log(dt);
            $.log('#newschool .messages', dt.getData("Text"));
            return false;
        });

});
