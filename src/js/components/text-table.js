export default function () {
    
    $('.text').find('table').each(function(){
		var $table = $(this),
			$table_wrap = $('<div class="table-responsive-wrap"><div class="table-responsive"></div></div>');

		$table.wrap($table_wrap);
	});

}