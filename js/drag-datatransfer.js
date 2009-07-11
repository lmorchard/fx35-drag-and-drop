/**
 * HTML5 Drag & Drop with data types
 */
$(document).ready(function() {

    // Set up the draggable element.
    $('#data_transfer .drag_delegates')
        .bind('dragstart', function(ev) {
            if (!$(ev.target).hasClass('dragme')) return true;

            var dt = ev.originalEvent.dataTransfer;
            switch (ev.target.id) {
                case 'datadrag0': 
                    dt.setData('text/plain', 'Hello world!');
                    break;
                case 'datadrag1':  
                    dt.setData('text/plain', $('#logo').parent().text());
                    dt.setData('text/html', $('#logo').parent().html());
                    dt.setData('text/uri-list', $('#logo')[0].src);
                    break;
                case 'datadrag2':
                    dt.setData('x-star-trek/tribble', 'I am a tribble');
                    break;
            }

            return true;
        });

    // Set up the drop zone.
    $('#data_transfer .drophere')

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

            if (dt.types.contains('x-star-trek/tribble')) {
                // Filter out this particular data type.
                $.log('#data_transfer .messages', 
                    'This data type is denied for drop.');
                return true;
            }

            var types = [];
            for (var i=0,type; type=dt.types[i]; i++)
                types.push(type);
            $.log('#data_transfer .messages', 
                'drop types received: ' + types.join(', ')); 

            // Grab a variety of data types we know how to handle
            $('#data_transfer .content_url .content')
                .text(dt.getData('URL'));
            $('#data_transfer .content_text .content')
                .text(dt.getData('Text'));
            $('#data_transfer .content_html .content')
                .html(dt.getData('text/html'));

            ev.stopPropagation();
            return false;
        });

});
