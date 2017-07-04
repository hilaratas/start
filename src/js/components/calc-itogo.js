export default function () {

	var $calcToggle = $('.js-calc-total__toogle');

	if ( !$calcToggle.length ) {
		return;
	}

	console.log($calcToggle);

	$calcToggle.on('change', calcTotal);

	function calcTotal(){

		var $thisForm = $(this).closest('form');

		var $calcSumElems = $('.js-calc-total__elem'),
			$calcOverpayElems = $('.js-calc-total__overpay'),
			$calcTotal = $('.js-calc-total__total'),
			sum = 0;

		$calcSumElems.each(function(){
			sum += parseFloat($(this).val());
		});

		if( $calcToggle.prop("checked") ) {
			sum += parseFloat($calcOverpayElems.val());
		}

		sum = sum.toFixed(2);		

		$calcTotal.val(sum);
	}

}