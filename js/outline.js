/**
 * Outline editing with HTML5 Drag & Drop
 *
 * @TODO: Try getting other media types to drop in 
 */
$(document).ready(function() {

    $.fn.tagName = function() {
        if (!this.get(0)) return;
        return this.get(0).tagName.toLowerCase();
    };

    $.fn.outliner = function() {
        return this.data('outliner', 
            new arguments.callee.support(this));
    }
    $.fn.outliner.support = function(root) {
        this.init.apply(this, arguments);
    }

    $.fn.outliner.support.prototype = {

        init: function(root) {
            this.last_id = 1;
            this.root    = root;
            this.dragged = false;

            this.wireUpEvents();
        },

        wireUpEvents: function() {
            var $this = this;
            this.root
                .find('li').attr('draggable', 'true').end()

                .bind('dragstart', function(ev) {
                    $this.dragged = ev.target;
                    $(ev.target).addClass('dragging');
                    var dt = ev.originalEvent.dataTransfer;
                    dt.setData('x-outliner', 'true');
                    
                    return true;
                })
                
                .bind('dragend', function(ev) {
                    $(ev.target).removeClass('dragging');
                    $this.clearDropFeedback();
                    return false;
                })

                .bind('dragenter', function(ev) {
                    $this.updateDropFeedback(ev);
                    return false;
                })

                .bind('dragover', function(ev) {
                    var drop = $this.determineDrop(ev);
                    if (!drop.allowed) return true;
                    return false;
                })

                .bind('drop', function(ev) {
                    $this.performDrop(ev);
                    $this.dragged = null;
                    $this.clearDropFeedback();
                    return false;
                });
        },

        getElementId: function(el) {
            if (!el.id) el.id = 'item-' + (++this.last_id);
            return el.id;
        },

        determineDrop: function(ev, target) {
            if (!target) target = $(ev.target);
            if ('div' != target.tagName())
                target.find('div:first');

            var t_pos = target.position();
            
            var drop = {
                land_above: ev.pageY < t_pos.top + (target.height()/2),
                land_child: ev.pageX > t_pos.left + 100,
                allowed:
                    ( target[0] != this.dragged ) &&
                    ( $.inArray(this.dragged, target.parents()) == -1 )
            };

            return drop;
        },

        getDropNode: function(ev) {
            var node = null;
            if (this.dragged) {
                
                node = $(this.dragged);
                while (node.tagName() != 'li') {
                    node = node.parent();
                }

            } else {

                node = $(document.createElement('li'));
                node.attr('draggable', 'true');

                var dt = ev.originalEvent.dataTransfer;
                var content = dt.getData('text/html');
                if (!content) content = dt.getData('text/plain');
                
                node.append('<div>'+content+'</div>');
                
                this.dragged = node;

            }
            return node;
        },

        clearDropFeedback: function() {
            $('.land_above').removeClass('land_above');
            $('.land_below').removeClass('land_below');
            $('.land_above_child').removeClass('land_above_child');
            $('.land_below_child').removeClass('land_below_child');
        },

        updateDropFeedback: function(ev) {
            var target = $(ev.target);
            if ('li'!=target.tagName())
                target = target.parents('li:first');

            this.clearDropFeedback();

            var drop = this.determineDrop(ev, target);
            if (!drop.allowed) return true;

            var class_name = 'land' +
                ((drop.land_above) ? '_above' : '_below') +
                ((drop.land_child) ? '_child' : '');
            target.addClass(class_name);
        },

        performDrop: function(ev) {
            var target = $(ev.target);

            if ('li' != target.tagName())
                target = target.parent('li');
            
            var drop = this.determineDrop(ev, target);
            if (!drop.allowed) return true;

            var node = this.getDropNode(ev);
            node.remove();
            if (drop.land_above) {
                if (drop.land_child) {
                    node.appendTo(this.getTargetUL(target.prev('li:last')));
                } else {
                    node.insertBefore(target);
                }
            } else {
                if (drop.land_child) {
                    node.prependTo(this.getTargetUL(target));
                } else {
                    node.insertAfter(target);
                }
            }

            return false;
        },

        getTargetUL: function(target) {
            var ul = target.find('ul:first');
            if (!ul.length) {
                target.append('<ul></ul>');
                ul = target.find('ul:first');
            }
            return ul;
        },

        EOF:null
    };

    $('.outline').outliner();

});
