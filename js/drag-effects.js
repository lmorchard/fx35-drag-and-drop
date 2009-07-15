/**
 * HTML5 Drag & Drop with feedback images
 */
$(document).ready(function() {

    // Set up the draggable element.
    $('#drag_effects .drag_delegates')
        .bind('dragstart', function(ev) {
            if (!$(ev.target).hasClass('dragme')) return true;

            var dt = ev.originalEvent.dataTransfer;
            switch (ev.target.id) {
                case 'effectdrag0': dt.effectAllowed = 'copy'; break;
                case 'effectdrag1': dt.effectAllowed = 'move'; break;
                case 'effectdrag2': dt.effectAllowed = 'link'; break;
                case 'effectdrag3': dt.effectAllowed = 'all'; break;
                case 'effectdrag4': dt.effectAllowed = 'none'; break;
            }
            dt.setData("Text", "Dropped " + ev.target.id);

            return true;
        });

    // Set up the drop zone.
    $('#drag_effects .drop_delegates')

        // Update the drop zone class on drag enter/leave
        .bind('dragenter', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;
            $(ev.target).addClass('dragover');
            return false;
        })
        .bind('dragleave', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;
            $(ev.target).removeClass('dragover');
            return false;
        })

        // Allow only drops of the appropriate kind here
        .bind('dragover', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;

            var dt = ev.originalEvent.dataTransfer;
            switch (ev.target.id) {
                case 'effectdrop0': dt.dropEffect = 'copy'; break;
                case 'effectdrop1': dt.dropEffect = 'move'; break;
                case 'effectdrop2': dt.dropEffect = 'link'; break;
                case 'effectdrop3': dt.dropEffect = 'all'; break;
                case 'effectdrop4': dt.dropEffect = 'none'; break;
            }

            return false;
        })

        // Handle the final drop...
        .bind('drop', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;

            var dt = ev.originalEvent.dataTransfer;
            $.log('#drag_effects .messages', [
                dt.getData("Text"), 
                'onto', 
                ev.target.id,
                '<br/>',
                'effectAllowed=' + dt.effectAllowed,
                'dropEffect=' + dt.dropEffect
            ].join(' '));
            ev.stopPropagation();
            return false;
        });

});
