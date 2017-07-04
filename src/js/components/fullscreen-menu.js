export default function () {

    var $fullScreenGumb = $('#js-fullscreen-menu-toggle'),
        $fullscreenMenu = $('#js-fullscreen-menu');


    $fullScreenGumb.on('click', function(){
        $('html').toggleClass("fullscreen-menu-open");
    });

    $fullscreenMenu
        .on('click', '.js-fullscreen-menu__toggle-next-level', function(event){
            event.preventDefault();
            $(this).parent().toggleClass('open');
        })
        .find(".active").addClass('open');
}