export default function () {

    $('table').not('.no-rotate').each(function(){

    	var html = '',
			table = $(this);

    	$(this).addClass('hidden visible-md visible-lg');
    	

		$('tr:gt(0)',table).each(function(){
			
			var count = 0,
				total = $('td',this).length;
				
			$('td',this).each(function(){
			
				if ( (count+1) == total && $('tr:eq(0) th',table).length ) {
					html += '<div class="mobile-table__tr mobile-table__tr--last-line"><div class="mobile-table__td">'+ $('tr:eq(0) th:eq('+count+')',table).html() +'</div><div class="mobile-table__td">'+$(this).html()+'</div></div>';
				} else if( $('tr:eq(0) th',table).length ) {
					html += '<div class="mobile-table__tr"><div class="mobile-table__td">'+ $('tr:eq(0) th:eq('+count+')',table).html() +'</div><div class="mobile-table__td">'+$(this).html()+'</div></div>';
				} 
				
				else if ( (count+1) == total && !$('tr:eq(0) th',table).length && count > 0 ) {
					html += '<div class="mobile-table__tr mobile-table__tr--last-line"><div class="mobile-table__td">'+ $(this).parents('tr').find('td:first').html() +'</div><div class="mobile-table__td">'+$(this).html()+'</div></div>';
				} else if( !$('tr:eq(0) th',table).length && count > 0 ) {
					html += '<div class="mobile-table__tr"><div class="mobile-table__td">'+ $(this).parents('tr').find('td:first').html() +'</div><div class="mobile-table__td">'+$(this).html()+'</div></div>';
				}
				count++;
			});
		});
		
		var addName = '';
		
		if( $(this).attr('data-mobile') ){
			addName = $(this).attr('data-mobile');
		}
		
		html = '<div class="mobile-table hidden visible-xs visible-sm '+addName+'">'+html+'</div>';
		
		$(this).after(html);



    });

}