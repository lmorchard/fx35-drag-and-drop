/**
 * Crappy implementation of old-school DHTML Drag & Drop.
 *
 * <div id="oldschool">
 *     <h2>Old school drag and drop</h2>
 *     <div class="dragme">Drag me!</div>
 *     <div class="drophere">Drop here!</div>
 * </div>
 */
$(document).ready(function() {

    $('#oldschool .dragme')
        
        // Prepare the drag element for positioning.
        .css('position','absolute')
        
        // Start dragging when mouse button down.
        .mousedown(function(ev) {
            $(ev.target).data('is_dragging', true);
            return false;
        })

        // Stop dragging when mouse up, check if in drop zone.
        .mouseup(function(ev) {
            $(ev.target).data('is_dragging', false);
            $('#oldschool .dragover').each(function() {
                $.log('#oldschool .messages', "Dropped in zone!");
            });
            $.log('#oldschool .messages', "Drag ended");
            return false;
        })

        // Perform move in response to drag, with drop zone detection.
        .mousemove(function(ev) {

            // Only move the element when mouse button down.
            if ($(ev.target).data('is_dragging')) {
                
                // Move the element, with a hardcoded pointer position around
                // the center of the draggable element.
                ev.target.style.left = ( ev.pageX - 32 ) + 'px';
                ev.target.style.top  = ( ev.pageY - 32 ) + 'px';

                // Work out the on-page rectangle of the drop zone for drag
                // detection
                var drophere = $('#oldschool .drophere'),
                    pos = drophere.offset(),
                    drophere_rect = {
                        left:   pos.left - $(document).scrollLeft(),
                        top:    pos.top - $(document).scrollTop(),
                        right:  pos.left + drophere.width(),
                        bottom: pos.top + drophere.height()
                    };

                // Has the mouse dragged into the drop zone?
                var in_drophere =
                    (drophere_rect.left <= ev.clientX) && 
                    (ev.clientX <= drophere_rect.right) &&
                    (drophere_rect.top <= ev.clientY) && 
                    (ev.clientY <= drophere_rect.bottom);

                // Update the drop zone class accordingly.
                if (in_drophere) {
                    $('#oldschool .drophere').addClass('dragover');
                } else {
                    $('#oldschool .drophere').removeClass('dragover');
                }
                return false;
            }

        });
});
