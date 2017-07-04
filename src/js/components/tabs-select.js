export default function () {

    $('.js-tabs-select').each(function(){
    	var $this = $(this),
    		$select = $this.find('select.js-tabs-select__select'),
    		$pages = $this.find('.js-tab-content__block'),
    		$orgCountHolder = $this.find('.js-select__count'),
    		msg = '';

    	$this.on('change', function(){
    		var selectedIndex = $select.val(),
    			$selectedPage = $pages.eq(selectedIndex),
    			orgCount = 0;

    			$pages.addClass('tabs__page--hide');
    			$selectedPage.removeClass('tabs__page--hide');

    			orgCount = $selectedPage.find('table').length;

    			if (orgCount) {
    				msg = orgCount + ' ' + declension(orgCount, ['организация найдена','организации найдено','организаций найдено']);
    			} else {
    				msg = "Не найдено ни одной организации";
    			}

    			$orgCountHolder.text(msg);

    	});
    });

    //склонение окончаний
	function declension(num, expressions) {
	    var result,
	    	count = num % 100;

	    if (count >= 5 && count <= 20) {
	        result = expressions['2'];
	    } else {
	        count = count % 10;
	        if (count == 1) {
	            result = expressions['0'];
	        } else if (count >= 2 && count <= 4) {
	            result = expressions['1'];
	        } else {
	            result = expressions['2'];
	        }
	    }
	    return result;
	}

}
