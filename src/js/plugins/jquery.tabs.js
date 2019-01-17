;(function($) {
  $.fn.tabs = function(options) {

    return this.each(function() {

      var $this = $(this),
          $btns = $this.find('.js-tab__switcher'),
          $pages = $this.find('.js-tab-content__block');

      //Сделаем активной первую кнопку
      $btns.first().addClass('active');

      //Скроем все страницы кроме первой
      $pages.not(':first').addClass('tabs__page--hide');

      //клик по кнопкам
      $btns.each(function(btnIndex, ele){
          $(ele).on('click', {index: btnIndex}, function(event){
            event.preventDefault();
            var $this = $(this),
                btnIndex = event.data.index,
                $selectPage = $pages.eq(btnIndex),
                isSelectPage = !!$selectPage.length,
                isBtnActive = !$this.hasClass('active');

            if (isSelectPage) {
              if (isBtnActive) {
                $btns.removeClass('active');
                $this.addClass('active');
                $pages.removeClass('tabs__page--show').addClass('tabs__page--hide');
                $selectPage.removeClass('tabs__page--hide').addClass('tabs__page--show');
              }
            } else {
              alert('Страница не найдена!');
            }
          });
      });
    });

  };
})(jQuery);