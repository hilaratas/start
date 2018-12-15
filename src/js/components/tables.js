export default function() {

	$('table').not('.trans-table').each(function(){
		var $table = $(this),
			$table_wrap = $('<div class="resp-table-wrap"><div class="resp-table-wrap__inner"></div></div>');
		$table.wrap($table_wrap);
		$table.closest(".resp-table-wrap")
			.prepend('<div class="resp-table-wrap__left-border"></div>')
	        .prepend('<div class="resp-table-wrap__right-border"></div>')
	        .prepend('<div class="resp-table-wrap__info"></div>');
	});

	$('table').filter('.trans-table').transTable();
}