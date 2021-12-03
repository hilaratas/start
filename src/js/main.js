import isMobile from './components/is-mobile';
import sliders from './components/sliders';
import gumburger from './components/gumburger';
import popups from './components/js-popup';
import validate from './components/validate';
import accordion from './components/js-accordion';
import tables from './components/tables';
import mainMenu from './components/js-main-menu';
import tabsComp from './components/tabs';

import mask from './components/js-mask';
import svg4everybody from './components/svg4everybody';
import svgStore from './components/svg-store';

$(function () {
  let htmlEl = document.documentElement;
  if (isMobile()) {
    htmlEl.classList.add('is-mobile');
  } else {
    htmlEl.classList.add('is-not-mobile');
  }

  sliders();
  gumburger();
  popups();
  validate();
  accordion();
  tables();
  mainMenu();
  tabsComp();
  mask();
  svg4everybody();
  svgStore();
});
