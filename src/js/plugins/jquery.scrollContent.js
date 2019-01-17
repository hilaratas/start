(function($) {
  $.fn.scrollContent = function(settings) {

    var $ts = this;
    var namespace = "scrollContent";
    var opts = $.extend( {blockClass: "scroll-content"}, settings);

    return this.each(function(){
      var t = this;
      var $t = $(this);
      var $tWrap = null;
      var $w = $(window);
      var blcl = opts.blockClass;
      var blclh = blcl + '--hidden';

      $t.trigger("initialize." + namespace);

      $t.wrap('<div class="' + blcl + ' ' + blclh + '"><div class="' + blcl + '__inner"></div></div>');
      $tWrap = $t.closest("." + blcl);
      $tWrap.prepend('<div class="' + blcl + '__left-border"></div>')
        .prepend('<div class="' + blcl + '__right-border"></div>')
        .prepend('<div class="' + blcl + '__info"></div>');

      wrapClass($t, $tWrap, blclh);

      $w.on('resize load', function() {
        wrapClass($t, $tWrap, blclh);
      });

      $t.trigger("initialized." + namespace);
    });

  };

  function wrapClass($block, $blockWrap, cl) {
    var block = $block.get(0);
    var blockWrap = $blockWrap.get(0);

    if ( block.scrollWidth > blockWrap.clientWidth ) {
      blockWrap.classList.remove(cl);
    } else {
      blockWrap.classList.add(cl);
    }
  }

})(jQuery);
