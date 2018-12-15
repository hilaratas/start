export default function () {

    let gumbEl = document.querySelector('#js-main-menu-toggle'),
        htmlEl = document.documentElement,
        $mainMenu = $('#js-main-menu');


    gumbEl.addEventListener('click', function(){
        htmlEl.classList.toggle("is-main-menu-open");
    });

    $mainMenu
        .on('click', '.js-fullscreen-menu__toggle-next-level', function(event){
            event.preventDefault();
            $(this).parent().toggleClass('open');
        })
        .find(".active").addClass('open');
}