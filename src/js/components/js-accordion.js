export default function () {
    
    $('.js-accordion').on('click', '.js-accordion__click', function(){
    	var $this = $(this);
    	
    	$this.closest('.js-accordion__item').toggleClass('active');
    });
}