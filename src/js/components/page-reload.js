export default function () {

	$('.js-select-page-reload').change(function(){
		var $this = $(this),
			$form = $($this.context.form);

		$form.submit();
	});

}