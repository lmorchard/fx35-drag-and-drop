/**
 * Quick & dirty table of contents and JS source links
 */
$(document).ready(function() {

    var sections = $('#toc .sections');
    var tmpl = sections.find('.template');
    $('div h2').each(function() {
        tmpl.clone().removeClass('template')
            .find('a')
                .attr('href', '#' + this.parentNode.id)
                .text($(this).text())
            .end()
            .appendTo(sections);
        $(this).append('<a href="#toc" class="toclink">Back to TOC</a>');
    });

    $('body div script').each(function() {
        $(this).after([
            '<p class="srclink">',
            '<a href="'+this.src+'" target="_new">View JS Source</a>',
            '</p>'
        ].join(''));
    });

}); 

$.log = function(sel, msg) {
    var d = new Date();
    $(sel).prepend([
        '<li class="line">',
            '<span class="time">', d, '</span>',
            '<span class="txt">', msg, '</span>',
        '</li>',
        "\n"
    ].join(''));
    $(sel).find('.line:first').effect('highlight', {}, 'slow');
}
