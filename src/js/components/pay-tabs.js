export default function () {
	
	if ( !$('#pay-tabs') ) {
		return;
	}

	var $tab1 = $('#pay-tabs').find('.pay-tabs__page1'),
		$tab2 = $('#pay-tabs').find('.pay-tabs__page2');

	$('body').on('click', '.js-show-pay-tab1', function(){
		$('#pay-tabs').find('.pay-tabs__page').removeClass('active').filter('.pay-tabs__page1').addClass('active');
		return false;
	});

	$('body').on('click', '.js-show-pay-tab2', function(){

		var $tab1Form = $tab1.find('form');

		if ( !$tab1Form.valid() ){
			return;
		}

		$tab1.removeClass('active');
		$tab2.addClass('active').addClass('loaded');
		$tab1Form.ajaxSubmit({
			success: function(responseText, statusText, xhr, $form){

				$tab2.removeClass('loaded');
				$tab2.html(responseText);

			},
			error: function(responseText, statusText, xhr, $form){
				$tab2.removeClass('active').removeClass('loaded');
				$tab1.addClass('active');

				var messages = "Ошибка сервера. Попробуйте повторить попытку позднее";
                var $mfpContent = $('<div/>').addClass('mfp-content-holder').append(messages);

				$.magnificPopup.open({
					items: {
						type: 'inline',
						src: $mfpContent
					}
				});
			}
		});
	});

}