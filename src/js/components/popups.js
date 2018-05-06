export default function () {

	$.extend(true, $.magnificPopup.defaults, {
		removalDelay: 300,
		mainClass: 'mfp-fade-in',
		fixedContentPos: true
	});
    
    $('.js-popup-inline').magnificPopup({
    	type:'inline'
    });

	$('.js-popup-image').magnificPopup({
		type: 'image',
    	image: {
			verticalFit: false
		}
	});

	$('.js-popup-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
    	image: {
			verticalFit: false
		}
	});

	$('.js-popup-inline, .js-popup-image, .js-popup-gallery')
		.on('mfpOpen', function(e){
			document.documentElement.classList.add('js-prevent-scroll');
		})
		.on('mfpClose', function(e){
			document.documentElement.classList.remove('js-prevent-scroll');
		});

	$(document).on('touchmove',function(e){
		var html = document.documentElement;

		if( document.documentElement.classList.contains('js-prevent-scroll')) {
			e.preventDefault();
		}
	});

	// Uses body because jQuery on events are called off of the element they are
	// added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart', '.mfp-wrap', function(e) {
		var html = document.documentElement;

		if( html.classList.contains('js-prevent-scroll') ){
		  if (e.currentTarget.scrollTop === 0) {
		    e.currentTarget.scrollTop = 1;
		  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
		    e.currentTarget.scrollTop -= 1;
		  }
	  	}
	});


	$('body').on('touchmove', '.mfp-wrap', function(e) {
	    // Only block default if internal div contents are large enough to scroll
	    // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
	    var html = document.documentElement;
	    if(  html.classList.contains('prevent-scroll') && $(this)[0].scrollHeight > $(this).innerHeight()) {
			e.stopPropagation();
		}
	});

}