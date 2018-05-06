export default function () {

	$.extend(true, $.magnificPopup.defaults, {
		removalDelay: 300,
		mainClass: 'mfp-fade-in',
		fixedContentPos: true,
		fixedBgPos: true 
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
			document.body.classList.add('page--open-popup');
			document.documentElement.classList.add('html--open-popup');
		})
		.on('mfpClose', function(e){
			document.body.classList.remove('page--open-popup');
			document.documentElement.classList.remove('html--open-popup');
		});

}