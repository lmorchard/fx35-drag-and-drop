/**
 * HTML5 Drag & Drop with feedback images
 */
$(document).ready(function() {

    // Set up the draggable element.
    $('#feedback_image .drag_delegates')
        .bind('dragstart', function(ev) {
            if (!$(ev.target).hasClass('dragme')) return true;

            var dt = ev.originalEvent.dataTransfer;
            dt.setData("Text", "Dropped " + ev.target.id);
            
            switch (ev.target.id) {

                case 'imgdrag0':
                    // Do nothing - an image of the draggable element will be
                    // used automatically..
                    break;

                case 'imgdrag1':
                    // Use the title for the section as a feedback image
                    dt.setDragImage( $('#feedback_image h2')[0], 0, 0);
                    break;
                
                case 'imgdrag2':
                    // Use the Firefox logo from the header.
                    dt.setDragImage( $('#logo')[0], 32, 32); 
                    break;

                case 'imgdrag3':
                    // Draw a triangle on a canvas and use that as feedback.
                    var canvas = document.createElement("canvas");
                    canvas.width = canvas.height = 50;

                    var ctx = canvas.getContext("2d");
                    ctx.lineWidth = 8;
                    ctx.moveTo(25,0);
                    ctx.lineTo(50, 50);
                    ctx.lineTo(0, 50);
                    ctx.lineTo(25, 0);
                    ctx.stroke();

                    dt.setDragImage(canvas, 25, 25);
                    break;

            }

            return true;
        });

    // Set up the drop zone.
    $('#feedback_image .drophere')

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

        // Allow drops of any kind into the zone.
        .bind('dragover', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;
            return false;
        })

        // Handle the final drop...
        .bind('drop', function(ev) {
            if (!$(ev.target).hasClass('drophere')) return true;

            var dt = ev.originalEvent.dataTransfer;
            $.log('#feedback_image .messages', 
                dt.getData("Text") + ' onto ' + ev.target.id);
            ev.stopPropagation();
            return false;
        });

});
