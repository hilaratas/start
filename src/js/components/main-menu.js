export default function () {
    
    $('.main-menu').each(function(){
    	var $mainMenu = $(this);

		$mainMenu.find('.main-menu__list').flexMenu({
			linkText: '',
			popupClass: 'main-menu__list-popup',
			showOnHover: true
		});


    	if (isTouchDevice()) {
	    	$mainMenu.find('.main-menu__item--has-child, .main-menu__item2--has-child').children('a').on('click', function(event){
	    		event.preventDefault();
	    		event.stopImmediatePropagation();

	    		var $this = $(event.target),
	    			$parent = $this.parent();

	    		$parent.toggleClass('open').siblings().removeClass('open');
	    		$mainMenu.addClass('open');

	    	});

	    	$("body").click(function(e) {
			    if($(e.target).closest($mainMenu).length==0) $mainMenu.find('.main-menu__item--has-child, .main-menu__item2--has-child').andSelf().removeClass('open');
			});	
	    } else {
	    	$('.main-menu__item--has-child, .main-menu__item2--has-child').children('a').on('click', function(event){
	    		event.preventDefault();
	    	});
	    }
    });
    

    function isTouchDevice() {
    	return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
	};

}