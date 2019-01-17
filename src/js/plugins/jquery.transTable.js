;(function($) {

  function makeClasses(string, param) {
    return string
      .split(' ')
      .filter(function(elem){return elem.length > 0;})
      .map(function(elem){ return elem + param})
      .join(' ');
  } 

  $.fn.transTable = function(optionsByUser) {

    var optionsDef = {
      'tableClass' : 'hidden visible-md visible-lg',
      'pseudoTableClass' : 'mobile-table',
      'pseudoWrapClass' : 'wrap',
      'copy' : 'html'
    };

    var options = $.extend(optionsDef, optionsByUser);

    var trClasses = makeClasses(options.pseudoTableClass, '__tr');
    var tdClasses = makeClasses(options.pseudoTableClass, '__td');

    return this.each(function(){

      var $table = $(this);
      var html = '';
      var $firstTr = $('tr:eq(0)',$table);
      var headInTop = ($('tr',$table).length > 1 ) && $firstTr.find('th').length;

      $table.addClass(options.tableClass);

      if ( headInTop ) {
        $('tr:gt(0)',$table).each(function(){
      
          var count = 0;
          var total = $('td',this).length;
          var header = '';
          var content = '';
          var addClass = '';
            
          $('td',this).each(function(){

            addClass = '';
            header  = options.copy == 'text' ? $firstTr.find('th:eq('+count+')').text() : $firstTr.find('th:eq('+count+')').html(); 
            content = options.copy == 'text' ? $(this).text() : $(this).html();

            if ( (count+1) == total ) {
              addClass = ' is-last-line';
            } else if ( count === 0 ) {
              addClass = ' is-first-line is-head';
            }

            html += '<div class="'+ trClasses + addClass + '"><div class="' + tdClasses + '">'+ header +'</div><div class="' + tdClasses + '">' + content + '</div></div>';

            count++;
          }); 
        });

      } else {
        
        $('tr', $table).each(function(){

          var $curTr = $(this);
          var count = 0;
          var total = $('td:gt(0)',$curTr).length;
          var header = '';
          var content = '';
          var addClass = '';
            
          $('td:gt(0), th:gt(0)', $curTr).each(function(){

            addClass = '';
            header = options.copy == 'text' ? $(this).parents('tr').find('td:first, th:first').text() : $(this).parents('tr').find('td:first, th:first').html();
            content = options.copy == 'text' ? $(this).text() : $(this).html();

            if ( (count+1) == total ) {
              addClass = ' is-last-line';
            } else if ( count === 0 ) {
              addClass = ' is-first-line';
            }

            html += '<div class="' + trClasses + addClass + '"><div class="' + tdClasses + '">' + header + '</div><div class="' + tdClasses + '">' + content + '</div></div>';

            count++;
          }); 
        });

      }

      html = '<div class="' + options.pseudoWrapClass + '"><div class="' + options.pseudoTableClass + '">' + html + '</div></div>';
      $table.after(html);
    });
  };


})(jQuery);