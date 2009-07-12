/**
 * Outline editing with HTML5 Drag & Drop
 */
$(document).ready(function() {

    $.fn.tagName = function() {
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
            var $this = this;

            $this.root = root;
            $this.root
                .find('li').attr('draggable', 'true').end()
                .data('last_id', 1);

            $this.wireUpEvents();
        },

        wireUpEvents: function() {
            var $this = this;
            $.each([
                'dragstart', 'drag', 'dragend', 'dragenter', 'dragover',
                'dragleave', 'drop'
            ], function() {
                var ev_name = this;
                if ('undefined' != typeof $this[ev_name])
                    $this.root.bind(ev_name, function(ev) { 
                        return $this[ev_name](ev);
                    })
            })
        },

        dragstart: function(ev) {
            var $this = this;
            if ('li' != $(ev.target).tagName()) return true;

            var dt = ev.originalEvent.dataTransfer;
            dt.setData('text/plain', $this.getElementId(ev.target));

            return true;
        },

        dragend: function(ev) {
            this.clearDropFeedback();
            return false;
        },

        dragover: function(ev) {
            this.clearDropFeedback();

            var drop = this.determineDrop(ev, $(ev.target));
            if (!drop.allowed) return true;
            
            this.updateDropFeedback(ev);
            return false;
        },

        drop: function(ev) {
            var $this = this;
            return $this.performDrop(ev);
            return false;
        },

        getElementId: function(el) {
            var $this = this;
            if (!el.id) {
                var last_id = $this.root.data('last_id');
                $this.root.data('last_id', ++last_id);
                el.id = 'i' + last_id;
            }
            return el.id;
        },

        determineDrop: function(ev, target) {
            var $this = this;

            if ('div' != target.tagName())
                target.find('div:first');

            var node = $this.getDropNode(ev);

            var t_pos = target.position();
            
            var drop = {
                land_above: ev.pageY < t_pos.top + (target.height()/2),
                land_child: ev.pageX > t_pos.left + 100,
                allowed:
                    ( target[0] != node ) &&
                    ( $.inArray(node, target.parents()) == -1 )
            };

            return drop;
        },

        getDropNode: function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            var el_id = dt.getData('text/plain');
            return document.getElementById(el_id);
        },

        clearDropFeedback: function() {
            $('.hover').removeClass('hover');
            $('.land_above').removeClass('land_above');
            $('.land_below').removeClass('land_below');
            $('.land_sibling').removeClass('land_sibling');
            $('.land_child').removeClass('land_child');
        },

        updateDropFeedback: function(ev) {
            var target = $(ev.target),
                drop   = this.determineDrop(ev, target);

            if ('li'!=target.tagName())
                target = target.parents('li:first');

            if ( drop.land_above ) {
                target.addClass('land_above');
            } else {
                target.addClass('land_below');
            }

            if ( drop.land_child ) {
                target.addClass('land_child');
            }
        },

        performDrop: function(ev) {
            var node   = this.getDropNode(ev),
                target = $(ev.target),
                node   = $(node);

            if ('li' != target.tagName())
                target = target.parent('li');
            
            var drop = this.determineDrop(ev, target);
            if (!drop.allowed) return true;

            node.remove();
            if (drop.land_above) {
                node.insertBefore(target);
            } else {
                if (!drop.land_child) {
                    node.insertAfter(target);
                } else {
                    var ul = target.find('ul');
                    if (!ul.length) {
                        target.append('<ul></ul>');
                        ul = target.find('ul');
                    }
                    node.prependTo(ul);
                }
            }

            return false;
        },

        EOF:null
    };

    $('.outline').outliner();

});
