/**
 * Main JS package for drag-and-drop demo.
 */
var Main = function($) {

    var $this = { 

        init: function () {
            this.initOldSchool();
            this.initNewSchool();
            //this.initDragging();

            return this;
        },
        
        initOldSchool: function() {


        },

        initNewSchool: function() {


        },

        initDragging: function() {

            $('.toys textarea')
                .focus(function() { this.select() });

            $('.events_monitor dt').each(function() {
                var dt = $(this),
                    dd = dt.next(),
                    event_name = dt.text();

                $('.draggable').add('.droparea').add('#delegated')
                    .bind(event_name, function(ev) {
                        dd.text([
                            'time='+ (new Date()).getTime(),
                            'id='+ev.target.id,
                            ('dragover'==ev.type || 'drop'==ev.type) ?
                                'x='+ev.pageX+'; y='+ev.pageY : ''
                        ].join('; '));
                        return true;
                    });
            });

            $('.draggable')
                .attr('draggable', 'true')
                
                .bind('dragstart', function(ev) {
                    console.log('dragstart ' + ev.target.id);

                    var dt = ev.originalEvent.dataTransfer;

                    dt.effectAllowed = 'move';
                    dt.dropEffect = 'move';
                    dt.setData("Text", ev.target.getAttribute('id'));
                    dt.setDragImage(ev.target,0,0);

                    /*
                    var canvas = document.createElement("canvas");
                    canvas.width = canvas.height = 50;

                    var ctx = canvas.getContext("2d");
                    ctx.lineWidth = 4;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(50, 50);
                    ctx.moveTo(0, 50);
                    ctx.lineTo(50, 0);
                    ctx.stroke();

                    dt.setDragImage(canvas, 25, 25);
                    */
                    return true;
                })

                .bind('drag', function(ev) {

                    return true;
                })

                .bind('dragend', function(ev) {
                    console.log('dragend ' + ev.target.id);

                    console.log(ev);


                    return true;
                })
                ;

            $('.droparea')
                .bind('dragenter', function(ev) {
                    console.log('dragenter ' + ev.target.id);
                    return true;
                })
                .bind('dragover', function(ev) {
                    var dt = ev.originalEvent.dataTransfer;
                    if (ev.target.id == 'b') {
                        return true;
                    }
                    return false;
                })
                .bind('dragleave', function(ev) {
                    console.log('dragleave ' + ev.target.id);
                    return true;
                })
                .bind('drop', function(ev) {
                    console.log('drop ' + ev.target.id);
                    ev.stopPropagation();
                    return false;

                }) ;

            $('#delegated')
                .bind('dragenter', function(ev) {
                    console.log('dragenter ' + ev.target.id);
                    return true;
                })
                .bind('dragover', function(ev) {
                    return false;
                })
                .bind('dragleave', function(ev) {
                    console.log('dragleave ' + ev.target.id);
                    return true;
                })
                .bind('drop', function(ev) {
                    console.log('drop ' + ev.target.id);
                    ev.stopPropagation();
                    return false;
                }) ;

        },

        dragStart: function(ev) {
            // console.log('dragStart ' + ev.target.id);

            var dt = ev.originalEvent.dataTransfer;
            dt.effectAllowed='link';
            dt.dropEffect='link';
            dt.setData("Text", ev.target.getAttribute('id'));
            //dt.setDragImage(ev.target,0,0);

            /*
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = 50;

            var ctx = canvas.getContext("2d");
            ctx.lineWidth = 4;
            ctx.moveTo(0, 0);
            ctx.lineTo(50, 50);
            ctx.moveTo(0, 50);
            ctx.lineTo(50, 0);
            ctx.stroke();

            dt.setDragImage(canvas, 25, 25);
            */
            
            return true;
        },

        dragEnd: function(ev) {
            // console.log('dragEnd ' + ev.target.id);
            var dt = ev.originalEvent.dataTransfer;
            dt.clearData("Text");
            return true;
        },

        dragEnter: function(ev) {
            // console.log('dragEnter ' + ev.target.id);
            var dt = ev.originalEvent.dataTransfer;
            var idelt = dt.getData("Text");
            return true;
        },

        EOF:null
    }
    return $this.init();
}(jQuery);
