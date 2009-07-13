/**
 * Outline editing with jQuery and HTML5 Drag & Drop
 * by l.m.orchard@pobox.com / http://decafbad.com
 */
(function($) {

    /**
     * Get lowercase tagname for node.
     */
    $.fn.tagName = function() {
        if (!this.get(0)) return;
        return this.get(0).tagName.toLowerCase();
    };

    /**
     * jQuery plugin interface for creating outliner instances.
     */
    $.fn.outliner = function() {
        return this.data('outliner', 
            new arguments.callee.support(this));
    }

    /**
     * Constructor for outliner support class.
     */
    $.fn.outliner.support = function(root) {
        this.init.apply(this, arguments);
    }

    /**
     * Support class for the outliner plugin.
     */
    $.fn.outliner.support.prototype = {

        /**
         * Initialize the outliner support object.
         */
        init: function(root) {
            this.root    = root;
            this.dragged = null;

            this.wireUpEvents();
        },

        /**
         * Wire up event handlers for the outliner.
         */
        wireUpEvents: function() {
            
            // Save an object reference for event handlers.
            var $this = this;

            this.root
                .find('li').attr('draggable', 'true').end()

                .bind('dragstart', function(ev) {
                    $this.setDraggedFromEvent(ev);
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
                    var drop = $this.checkDrop(ev, $(ev.target));
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

        /**
         * Capture the node dragged from an event.
         */
        setDraggedFromEvent: function(ev) {

            // dragged property works for drops inside the root doc.
            var node = $(ev.target);
            while (node.tagName() != 'li') {
                node = node.parent();
            }
            this.dragged = node;
            this.dragged.addClass('dragging');

            // Set text & HTML content for drops outside the root doc.
            var dt = ev.originalEvent.dataTransfer;
            dt.setData('text/html', this.dragged.html());
            dt.setData('text/plain', this.dragged.text());

        },

        /**
         * Get the node dragged, whether captured by us or dragged in from
         * another window.
         */
        getDragged: function(ev) {
            var node = null;
            if (this.dragged) {
                // Use the node captured at dragstart, if available.
                node = this.dragged;
            } else {

                // Look for HTML or text content dragged in from outside.
                var dt = ev.originalEvent.dataTransfer;
                var content = dt.getData('text/html');
                if (!content) content = dt.getData('text/plain');
                
                if (content) {
                    // If any content available, build a new node for drop.
                    node = $(document.createElement('li'));
                    node.attr('draggable', 'true');
                    node.append('<div>'+content+'</div>');

                    // Remember this node for next check.
                    this.dragged = node;
                }

            }
            return node;
        },

        /**
         * Determine details for potential drop, given an event from one of the
         * drop listeners.
         */
        checkDrop: function(ev, target) {
            var t_pos = target.position();
            var drop = {
                land_above: ev.pageY < t_pos.top + (target.height()/2),
                land_child: ev.pageX > t_pos.left + 75,
                allowed:
                    !this.dragged ||
                    ( this.dragged && 
                        ( target[0] != this.dragged[0] ) &&
                        ( $.inArray(this.dragged[0], target.parents()) == -1 )
                    )
            };
            return drop;
        },

        /**
         * Clear all drop feedback set on dragovers.
         */
        clearDropFeedback: function() {
            $('.land_above').removeClass('land_above');
            $('.land_below').removeClass('land_below');
            $('.land_above_child').removeClass('land_above_child');
            $('.land_below_child').removeClass('land_below_child');
        },

        /**
         * Update the feedback for drop on dragover.
         */
        updateDropFeedback: function(ev) {

            // Find the list node for this event target.
            var target = $(ev.target);
            if ('li'!=target.tagName())
                target = target.parents('li:first');

            // Clear any existing feedback.
            this.clearDropFeedback();

            // Check if a drop is allowed here, escape if not.
            var drop = this.checkDrop(ev, target);
            if (!drop.allowed) return true;

            // Set the appropriate CSS class for feedback.
            var class_name = 'land' +
                ((drop.land_above) ? '_above' : '_below') +
                ((drop.land_child) ? '_child' : '');
            target.addClass(class_name);

        },

        /**
         * Perform the drop suggested by the event.
         */
        performDrop: function(ev) {
            
            // Find the list node for this event target.
            var target = $(ev.target);
            if ('li' != target.tagName())
                target = target.parent('li');
            
            // Check if a drop is allowed here, escape if not.
            var drop = this.checkDrop(ev, target);
            if (!drop.allowed) return true;

            // Try getting the dragged node, escape if none.
            var node = this.getDragged(ev);
            if (!node) return true;

            // Work out the proper DOM operation to complete the drop.
            if (drop.land_above) {
                if (drop.land_child) {
                    var prev = target.prev('li:last');
                    if (prev.length) {
                        // If there's a previous item, append to its list.
                        node.appendTo(this.getTargetUL(prev));
                    } else {
                        // Otherwise, just land as a sibling before.
                        node.insertBefore(target);
                    }
                } else {
                    // Not a child drop, so just insert before.
                    node.insertBefore(target);
                }
            } else {
                if (drop.land_child) {
                    // Land as a child below.
                    node.prependTo(this.getTargetUL(target));
                } else {
                    // Land as a sibling after.
                    node.insertAfter(target);
                }
            }

            return false;
        },

        /**
         * Find a child list for the given target, creating a new one if
         * necessary.
         */
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

})(jQuery);
