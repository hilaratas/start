export default function() {

	$('table.js-scroll-content').scrollContent();

	$('table').not('.js-scroll-content').transTable();
}