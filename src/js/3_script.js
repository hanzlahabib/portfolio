
/*!
 * fullPage 3.0.8
 * https://github.com/alvarotrigo/fullPage.js
 *
 * @license GPLv3 for open source use only
 * or Fullpage Commercial License for commercial use
 * http://alvarotrigo.com/fullPage/pricing/
 *
 * Copyright (C) 2018 http://alvarotrigo.com/fullPage - A project by Alvaro Trigo
 */
(function( root, window, document, factory, undefined) {
  if( typeof define === 'function' && define.amd ) {
      // AMD. Register as an anonymous module.
      define( function() {
          root.fullpage = factory(window, document);
          return root.fullpage;
      } );
  } else if( typeof exports === 'object' ) {
      // Node. Does not work with strict CommonJS.
      module.exports = factory(window, document);
  } else {
      // Browser globals.
      window.fullpage = factory(window, document);
  }
}(this, window, document, function(window, document){
  'use strict';

  // keeping central set of classnames and selectors
  var WRAPPER =               'fullpage-wrapper';
  var WRAPPER_SEL =           '.' + WRAPPER;

  // slimscroll
  var SCROLLABLE =            'fp-scrollable';
  var SCROLLABLE_SEL =        '.' + SCROLLABLE;

  // util
  var RESPONSIVE =            'fp-responsive';
  var NO_TRANSITION =         'fp-notransition';
  var DESTROYED =             'fp-destroyed';
  var ENABLED =               'fp-enabled';
  var VIEWING_PREFIX =        'fp-viewing';
  var ACTIVE =                'active';
  var ACTIVE_SEL =            '.' + ACTIVE;
  var COMPLETELY =            'fp-completely';
  var COMPLETELY_SEL =        '.' + COMPLETELY;

  // section
  var SECTION_DEFAULT_SEL =   '.section';
  var SECTION =               'fp-section';
  var SECTION_SEL =           '.' + SECTION;
  var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
  var TABLE_CELL =            'fp-tableCell';
  var TABLE_CELL_SEL =        '.' + TABLE_CELL;
  var AUTO_HEIGHT =           'fp-auto-height';
  var AUTO_HEIGHT_SEL =       '.' + AUTO_HEIGHT;
  var AUTO_HEIGHT_RESPONSIVE = 'fp-auto-height-responsive';
  var AUTO_HEIGHT_RESPONSIVE_SEL = '.' + AUTO_HEIGHT_RESPONSIVE;
  var NORMAL_SCROLL =         'fp-normal-scroll';
  var NORMAL_SCROLL_SEL =     '.' + NORMAL_SCROLL;

  // section nav
  var SECTION_NAV =           'fp-nav';
  var SECTION_NAV_SEL =       '#' + SECTION_NAV;
  var SECTION_NAV_TOOLTIP =   'fp-tooltip';
  var SECTION_NAV_TOOLTIP_SEL='.'+SECTION_NAV_TOOLTIP;
  var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

  // slide
  var SLIDE_DEFAULT_SEL =     '.slide';
  var SLIDE =                 'fp-slide';
  var SLIDE_SEL =             '.' + SLIDE;
  var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
  var SLIDES_WRAPPER =        'fp-slides';
  var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
  var SLIDES_CONTAINER =      'fp-slidesContainer';
  var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;
  var TABLE =                 'fp-table';

  // slide nav
  var SLIDES_NAV =            'fp-slidesNav';
  var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
  var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
  var SLIDES_ARROW =          'fp-controlArrow';
  var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
  var SLIDES_PREV =           'fp-prev';
  var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
  var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
  var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
  var SLIDES_NEXT =           'fp-next';
  var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
  var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
  var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

  function initialise(containerSelector, options) {
      var isOK = options && new RegExp('([\\d\\w]{8}-){3}[\\d\\w]{8}|^(?=.*?[A-Y])(?=.*?[a-y])(?=.*?[0-8])(?=.*?[#?!@$%^&*-]).{8,}$').test(options['li'+'cen'+'seK' + 'e' + 'y']) || document.domain.indexOf('al'+'varotri' +'go' + '.' + 'com') > -1;

      // cache common elements
      var $htmlBody = $('html, body');
      var $html = $('html')[0];
      var $body = $('body')[0];

      //only once my friend!
      if(hasClass($html, ENABLED)){ displayWarnings(); return; }

      var FP = {};

      // Creating some defaults, extending them with any options that were provided
      options = deepExtend({
          //navigation
          menu: false,
          anchors:[],
          lockAnchors: false,
          navigation: false,
          navigationPosition: 'right',
          navigationTooltips: [],
          showActiveTooltip: false,
          slidesNavigation: false,
          slidesNavPosition: 'bottom',
          scrollBar: false,
          hybrid: false,

          //scrolling
          css3: true,
          scrollingSpeed: 700,
          autoScrolling: true,
          fitToSection: true,
          fitToSectionDelay: 1000,
          easing: 'easeInOutCubic',
          easingcss3: 'ease',
          loopBottom: false,
          loopTop: false,
          loopHorizontal: true,
          continuousVertical: false,
          continuousHorizontal: false,
          scrollHorizontally: false,
          interlockedSlides: false,
          dragAndMove: false,
          offsetSections: false,
          resetSliders: false,
          fadingEffect: false,
          normalScrollElements: null,
          scrollOverflow: false,
          scrollOverflowReset: false,
          scrollOverflowHandler: window.fp_scrolloverflow ? window.fp_scrolloverflow.iscrollHandler : null,
          scrollOverflowOptions: null,
          touchSensitivity: 5,
          touchWrapper: typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector,
          bigSectionsDestination: null,

          //Accessibility
          keyboardScrolling: true,
          animateAnchor: true,
          recordHistory: true,

          //design
          controlArrows: true,
          controlArrowColor: '#fff',
          verticalCentered: true,
          sectionsColor : [],
          paddingTop: 0,
          paddingBottom: 0,
          fixedElements: null,
          responsive: 0, //backwards compabitility with responsiveWiddth
          responsiveWidth: 0,
          responsiveHeight: 0,
          responsiveSlides: false,
          parallax: false,
          parallaxOptions: {
              type: 'reveal',
              percentage: 62,
              property: 'translate'
          },
          cards: false,
          cardsOptions: {
              perspective: 100,
              fadeContent: true,
              fadeBackground: true
          },

          //Custom selectors
          sectionSelector: SECTION_DEFAULT_SEL,
          slideSelector: SLIDE_DEFAULT_SEL,

          //events
          v2compatible: false,
          afterLoad: null,
          onLeave: null,
          afterRender: null,
          afterResize: null,
          afterReBuild: null,
          afterSlideLoad: null,
          onSlideLeave: null,
          afterResponsive: null,

          lazyLoading: true
      }, options);

      //flag to avoid very fast sliding for landscape sliders
      var slideMoving = false;

      var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
      var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
      var container = typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector;
      var windowsHeight = getWindowHeight();
      var windowsWidth = getWindowWidth();
      var isResizing = false;
      var isWindowFocused = true;
      var lastScrolledDestiny;
      var lastScrolledSlide;
      var canScroll = true;
      var scrollings = [];
      var controlPressed;
      var startingSection;
      var isScrollAllowed = {};
      isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
      isScrollAllowed.k = deepExtend({}, isScrollAllowed.m);
      var MSPointer = getMSPointer();
      var events = {
          touchmove: 'ontouchmove' in window ? 'touchmove' :  MSPointer.move,
          touchstart: 'ontouchstart' in window ? 'touchstart' :  MSPointer.down
      };
      var scrollBarHandler;

      // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js
      var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

      //cheks for passive event support
      var g_supportsPassive = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            g_supportsPassive = true;
          }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
      } catch (e) {}

      //timeouts
      var resizeId;
      var resizeHandlerId;
      var afterSectionLoadsId;
      var afterSlideLoadsId;
      var scrollId;
      var scrollId2;
      var keydownId;
      var g_doubleCheckHeightId;
      var originals = deepExtend({}, options); //deep copy
      var activeAnimation;
      var g_initialAnchorsInDom = false;
      var g_canFireMouseEnterNormalScroll = true;
      var g_mediaLoadedId;
      var extensions = [
          'parallax',
          'scrollOverflowReset',
          'dragAndMove',
          'offsetSections',
          'fadingEffect',
          'responsiveSlides',
          'continuousHorizontal',
          'interlockedSlides',
          'scrollHorizontally',
          'resetSliders',
          'cards'
      ];

      displayWarnings();

      //easeInOutCubic animation included in the plugin
      window.fp_easings = deepExtend(window.fp_easings, {
          easeInOutCubic: function (t, b, c, d) {
              if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;
          }
      });

      /**
      * Sets the autoScroll option.
      * It changes the scroll bar visibility and the history of the site as a result.
      */
      function setAutoScrolling(value, type){
          //removing the transformation
          if(!value){
              silentScroll(0);
          }

          setVariableState('autoScrolling', value, type);

          var element = $(SECTION_ACTIVE_SEL)[0];

          if(options.autoScrolling && !options.scrollBar){
              css($htmlBody, {
                  'overflow': 'hidden',
                  'height': '100%'
              });

              setRecordHistory(originals.recordHistory, 'internal');

              //for IE touch devices
              css(container, {
                  '-ms-touch-action': 'none',
                  'touch-action': 'none'
              });

              if(element != null){
                  //moving the container up
                  silentScroll(element.offsetTop);
              }
          }else{
              css($htmlBody, {
                  'overflow' : 'visible',
                  'height' : 'initial'
              });

              var recordHistory = !options.autoScrolling ? false : originals.recordHistory;
              setRecordHistory(recordHistory, 'internal');

              //for IE touch devices
              css(container, {
                  '-ms-touch-action': '',
                  'touch-action': ''
              });

              //scrolling the page to the section with no animation
              if (element != null) {
                  var scrollSettings = getScrollSettings(element.offsetTop);
                  scrollSettings.element.scrollTo(0, scrollSettings.options);
              }
          }
      }

      /**
      * Defines wheter to record the history for each hash change in the URL.
      */
      function setRecordHistory(value, type){
          setVariableState('recordHistory', value, type);
      }

      /**
      * Defines the scrolling speed
      */
      function setScrollingSpeed(value, type){
          setVariableState('scrollingSpeed', value, type);
      }

      /**
      * Sets fitToSection
      */
      function setFitToSection(value, type){
          setVariableState('fitToSection', value, type);
      }

      /**
      * Sets lockAnchors
      */
      function setLockAnchors(value){
          options.lockAnchors = value;
      }

      /**
      * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
      */
      function setMouseWheelScrolling(value){
          if(value){
              addMouseWheelHandler();
              addMiddleWheelHandler();
          }else{
              removeMouseWheelHandler();
              removeMiddleWheelHandler();
          }
      }

      /**
      * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
      * Optionally a second parameter can be used to specify the direction for which the action will be applied.
      *
      * @param directions string containing the direction or directions separated by comma.
      */
      function setAllowScrolling(value, directions){
          if(typeof directions !== 'undefined'){
              directions = directions.replace(/ /g,'').split(',');

              directions.forEach(function (direction){
                  setIsScrollAllowed(value, direction, 'm');
              });
          }
          else{
              setIsScrollAllowed(value, 'all', 'm');
          }
      }

      /**
      * Adds or remove the mouse wheel hijacking
      */
      function setMouseHijack(value){
          if(value){
              setMouseWheelScrolling(true);
              addTouchHandler();
          }else{
              setMouseWheelScrolling(false);
              removeTouchHandler();
          }
      }

      /**
      * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
      */
      function setKeyboardScrolling(value, directions){
          if(typeof directions !== 'undefined'){
              directions = directions.replace(/ /g,'').split(',');

              directions.forEach(function(direction){
                  setIsScrollAllowed(value, direction, 'k');
              });
          }else{
              setIsScrollAllowed(value, 'all', 'k');
              options.keyboardScrolling = value;
          }
      }

      /**
      * Moves the page up one section.
      */
      function moveSectionUp(){
          var prev = prevUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);

          //looping to the bottom if there's no more sections above
          if (!prev && (options.loopTop || options.continuousVertical)) {
              prev = last($(SECTION_SEL));
          }

          if (prev != null) {
              scrollPage(prev, null, true);
          }
      }

      /**
      * Moves the page down one section.
      */
      function moveSectionDown(){
          var next = nextUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);

          //looping to the top if there's no more sections below
          if(!next &&
              (options.loopBottom || options.continuousVertical)){
              next = $(SECTION_SEL)[0];
          }

          if(next != null){
              scrollPage(next, null, false);
          }
      }

      /**
      * Moves the page to the given section and slide with no animation.
      * Anchors or index positions can be used as params.
      */
      function silentMoveTo(sectionAnchor, slideAnchor){
          setScrollingSpeed (0, 'internal');
          moveTo(sectionAnchor, slideAnchor);
          setScrollingSpeed (originals.scrollingSpeed, 'internal');
      }

      /**
      * Moves the page to the given section and slide.
      * Anchors or index positions can be used as params.
      */
      function moveTo(sectionAnchor, slideAnchor){
          var destiny = getSectionByAnchor(sectionAnchor);

          if (typeof slideAnchor !== 'undefined'){
              scrollPageAndSlide(sectionAnchor, slideAnchor);
          }else if(destiny != null){
              scrollPage(destiny);
          }
      }

      /**
      * Slides right the slider of the active section.
      * Optional `section` param.
      */
      function moveSlideRight(section){
          moveSlide('right', section);
      }

      /**
      * Slides left the slider of the active section.
      * Optional `section` param.
      */
      function moveSlideLeft(section){
          moveSlide('left', section);
      }

      /**
       * When resizing is finished, we adjust the slides sizes and positions
       */
      function reBuild(resizing){
          if(hasClass(container, DESTROYED)){ return; }  //nothing to do if the plugin was destroyed

          isResizing = true;

          //updating global vars
          windowsHeight = getWindowHeight();
          windowsWidth = getWindowWidth();

          var sections = $(SECTION_SEL);
          for (var i = 0; i < sections.length; ++i) {
              var section = sections[i];
              var slidesWrap = $(SLIDES_WRAPPER_SEL, section)[0];
              var slides = $(SLIDE_SEL, section);

              //adjusting the height of the table-cell for IE and Firefox
              if(options.verticalCentered){
                  css($(TABLE_CELL_SEL, section), {'height': getTableHeight(section) + 'px'});
              }

              css(section, {'height': windowsHeight + 'px'});

              //adjusting the position fo the FULL WIDTH slides...
              if (slides.length > 1) {
                  landscapeScroll(slidesWrap, $(SLIDE_ACTIVE_SEL, slidesWrap)[0]);
              }
          }

          if(options.scrollOverflow){
              scrollBarHandler.createScrollBarForAll();
          }

          var activeSection = $(SECTION_ACTIVE_SEL)[0];
          var sectionIndex = index(activeSection, SECTION_SEL);

          //isn't it the first section?
          if(sectionIndex){
              //adjusting the position for the current section
              silentMoveTo(sectionIndex + 1);
          }

          isResizing = false;
          if(isFunction( options.afterResize ) && resizing){
              options.afterResize.call(container, window.innerWidth, window.innerHeight);
          }
          if(isFunction( options.afterReBuild ) && !resizing){
              options.afterReBuild.call(container);
          }
      }

      /**
      * Determines whether fullpage.js is in responsive mode or not.
      */
      function isResponsiveMode(){
         return hasClass($body, RESPONSIVE);
      }

      /**
      * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
      * are smaller than the set limit values.
      */
      function setResponsive(active){
          var isResponsive = isResponsiveMode();

          if(active){
              if(!isResponsive){
                  setAutoScrolling(false, 'internal');
                  setFitToSection(false, 'internal');
                  hide($(SECTION_NAV_SEL));
                  addClass($body, RESPONSIVE);
                  if(isFunction( options.afterResponsive )){
                      options.afterResponsive.call( container, active);
                  }

                  //when on page load, we will remove scrolloverflow if necessary
                  if(options.scrollOverflow){
                      scrollBarHandler.createScrollBarForAll();
                  }
              }
          }
          else if(isResponsive){
              setAutoScrolling(originals.autoScrolling, 'internal');
              setFitToSection(originals.autoScrolling, 'internal');
              show($(SECTION_NAV_SEL));
              removeClass($body, RESPONSIVE);
              if(isFunction( options.afterResponsive )){
                  options.afterResponsive.call( container, active);
              }
          }
      }

      if(container){
          //public functions
          FP.version = '3.0.8';
          FP.setAutoScrolling = setAutoScrolling;
          FP.setRecordHistory = setRecordHistory;
          FP.setScrollingSpeed = setScrollingSpeed;
          FP.setFitToSection = setFitToSection;
          FP.setLockAnchors = setLockAnchors;
          FP.setMouseWheelScrolling = setMouseWheelScrolling;
          FP.setAllowScrolling = setAllowScrolling;
          FP.setKeyboardScrolling = setKeyboardScrolling;
          FP.moveSectionUp = moveSectionUp;
          FP.moveSectionDown = moveSectionDown;
          FP.silentMoveTo = silentMoveTo;
          FP.moveTo = moveTo;
          FP.moveSlideRight = moveSlideRight;
          FP.moveSlideLeft = moveSlideLeft;
          FP.fitToSection = fitToSection;
          FP.reBuild = reBuild;
          FP.setResponsive = setResponsive;
          FP.getFullpageData = function(){ return options; };
          FP.destroy = destroy;
          FP.getActiveSection = getActiveSection;
          FP.getActiveSlide = getActiveSlide;

          FP.test = {
              top: '0px',
              translate3d: 'translate3d(0px, 0px, 0px)',
              translate3dH: (function(){
                  var a = [];
                  for(var i = 0; i < $(options.sectionSelector, container).length; i++){
                      a.push('translate3d(0px, 0px, 0px)');
                  }
                  return a;
              })(),
              left: (function(){
                  var a = [];
                  for(var i = 0; i < $(options.sectionSelector, container).length; i++){
                      a.push(0);
                  }
                  return a;
              })(),
              options: options,
              setAutoScrolling: setAutoScrolling
          };

          //functions we want to share across files but which are not
          //mean to be used on their own by developers
          FP.shared = {
              afterRenderActions: afterRenderActions,
              isNormalScrollElement: false
          };

          window.fullpage_api = FP;

          //using jQuery initialization? Creating the $.fn.fullpage object
          if(options.$){
              Object.keys(FP).forEach(function (key) {
                  options.$.fn.fullpage[key] = FP[key];
              });
          }

          init();

          bindEvents();
      }

      function init(){
          //if css3 is not supported, it will use jQuery animations
          if(options.css3){
              options.css3 = support3d();
          }

          options.scrollBar = options.scrollBar || options.hybrid;

          setOptionsFromDOM();
          prepareDom();
          setAllowScrolling(true);
          setMouseHijack(true);
          setAutoScrolling(options.autoScrolling, 'internal');
          responsive();

          //setting the class for the body element
          setBodyClass();

          if(document.readyState === 'complete'){
              scrollToAnchor();
          }
          window.addEventListener('load', scrollToAnchor);

          //if we use scrollOverflow we'll fire afterRender in the scrolloverflow file
          if(!options.scrollOverflow){
              afterRenderActions();
          }

          doubleCheckHeight();
      }

      function bindEvents(){

          //when scrolling...
          window.addEventListener('scroll', scrollHandler);

          //detecting any change on the URL to scroll to the given anchor link
          //(a way to detect back history button as we play with the hashes on the URL)
          window.addEventListener('hashchange', hashChangeHandler);

          //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
          window.addEventListener('blur', blurHandler);

          //when resizing the site, we adjust the heights of the sections, slimScroll...
          window.addEventListener('resize', resizeHandler);

          //Sliding with arrow keys, both, vertical and horizontal
          document.addEventListener('keydown', keydownHandler);

          //to prevent scrolling while zooming
          document.addEventListener('keyup', keyUpHandler);

          //Scrolls to the section when clicking the navigation bullet
          //simulating the jQuery .on('click') event using delegation
          ['click', 'touchstart'].forEach(function(eventName){
              document.addEventListener(eventName, delegatedEvents);
          });

          /**
          * Applying normalScroll elements.
          * Ignoring the scrolls over the specified selectors.
          */
          if(options.normalScrollElements){
              ['mouseenter', 'touchstart'].forEach(function(eventName){
                  forMouseLeaveOrTouch(eventName, false);
              });

              ['mouseleave', 'touchend'].forEach(function(eventName){
                 forMouseLeaveOrTouch(eventName, true);
              });
          }
      }

      function delegatedEvents(e){
          var target = e.target;

          if(target && closest(target, SECTION_NAV_SEL + ' a')){
              sectionBulletHandler.call(target, e);
          }
          else if(matches(target, SECTION_NAV_TOOLTIP_SEL)){
              tooltipTextHandler.call(target);
          }
          else if(matches(target, SLIDES_ARROW_SEL)){
              slideArrowHandler.call(target, e);
          }
          else if(matches(target, SLIDES_NAV_LINK_SEL) || closest(target, SLIDES_NAV_LINK_SEL) != null){
              slideBulletHandler.call(target, e);
          }
          else if(closest(target, options.menu + ' [data-menuanchor]')){
              menuItemsHandler.call(target, e);
          }
      }

      function forMouseLeaveOrTouch(eventName, allowScrolling){
          //a way to pass arguments to the onMouseEnterOrLeave function
          document['fp_' + eventName] = allowScrolling;
          document.addEventListener(eventName, onMouseEnterOrLeave, true); //capturing phase
      }

      function onMouseEnterOrLeave(e) {
          var type = e.type;
          var isInsideOneNormalScroll = false;
          var isUsingScrollOverflow = options.scrollOverflow;

          //onMouseLeave will use the destination target, not the one we are moving away from
          var target = type === 'mouseleave' ? e.toElement || e.relatedTarget : e.target;

          //coming from closing a normalScrollElements modal or moving outside viewport?
          if(target == document || !target){
              setMouseHijack(true);

              if(isUsingScrollOverflow){
                  options.scrollOverflowHandler.setIscroll(target, true);
              }
              return;
          }

          if(type === 'touchend'){
              g_canFireMouseEnterNormalScroll = false;
              setTimeout(function(){
                  g_canFireMouseEnterNormalScroll = true;
              }, 800);
          }

          //preventing mouseenter event to do anything when coming from a touchEnd event
          //fixing issue #3576
          if(type === 'mouseenter' && !g_canFireMouseEnterNormalScroll){
              return;
          }

          var normalSelectors = options.normalScrollElements.split(',');

          normalSelectors.forEach(function(normalSelector){
              if(!isInsideOneNormalScroll){
                  var isNormalScrollTarget = matches(target, normalSelector);

                  //leaving a child inside the normalScoll element is not leaving the normalScroll #3661
                  var isNormalScrollChildFocused = closest(target, normalSelector);

                  if(isNormalScrollTarget || isNormalScrollChildFocused){
                      if(!FP.shared.isNormalScrollElement){
                          setMouseHijack(false);

                          if(isUsingScrollOverflow){
                              options.scrollOverflowHandler.setIscroll(target, false);
                          }
                      }
                      FP.shared.isNormalScrollElement = true;
                      isInsideOneNormalScroll = true;
                  }
              }
          });

          //not inside a single normal scroll element anymore?
          if(!isInsideOneNormalScroll && FP.shared.isNormalScrollElement){
              setMouseHijack(true);

              if(isUsingScrollOverflow){
                  options.scrollOverflowHandler.setIscroll(target, true);
              }

              FP.shared.isNormalScrollElement = false;
          }
      }

      /**
      * Checks the viewport a few times on a define interval of time to
      * see if it has changed in any of those. If that's the case, it resizes.
      */
      function doubleCheckHeight(){
          for(var i = 1; i < 4; i++){
              g_doubleCheckHeightId = setTimeout(adjustToNewViewport, 350 * i);
          }
      }

      /**
      * Adjusts a section to the viewport if it has changed.
      */
      function adjustToNewViewport(){
          var newWindowHeight = getWindowHeight();
          var newWindowWidth = getWindowWidth();

          if(windowsHeight !== newWindowHeight || windowsWidth !== newWindowWidth){
              windowsHeight = newWindowHeight;
              windowsWidth = newWindowWidth;
              reBuild(true);
          }
      }

      /**
      * Setting options from DOM elements if they are not provided.
      */
      function setOptionsFromDOM(){

          //no anchors option? Checking for them in the DOM attributes
          if(!options.anchors.length){
              var anchorsAttribute = '[data-anchor]';
              var anchors = $(options.sectionSelector.split(',').join(anchorsAttribute + ',') + anchorsAttribute, container);
              if(anchors.length){
                  g_initialAnchorsInDom = true;
                  anchors.forEach(function(item){
                      options.anchors.push(item.getAttribute('data-anchor').toString());
                  });
              }
          }

          //no tooltips option? Checking for them in the DOM attributes
          if(!options.navigationTooltips.length){
              var tooltipsAttribute = '[data-tooltip]';
              var tooltips = $(options.sectionSelector.split(',').join(tooltipsAttribute + ',') + tooltipsAttribute, container);
              if(tooltips.length){
                  tooltips.forEach(function(item){
                      options.navigationTooltips.push(item.getAttribute('data-tooltip').toString());
                  });
              }
          }
      }

      /**
      * Works over the DOM structure to set it up for the current fullpage options.
      */
      function prepareDom(){
          css(container, {
              'height': '100%',
              'position': 'relative'
          });

          //adding a class to recognize the container internally in the code
          addClass(container, WRAPPER);
          addClass($html, ENABLED);

          //due to https://github.com/alvarotrigo/fullPage.js/issues/1502
          windowsHeight = getWindowHeight();

          removeClass(container, DESTROYED); //in case it was destroyed before initializing it again

          addInternalSelectors();

          var sections = $(SECTION_SEL);

          //styling the sections / slides / menu
          for(var i = 0; i<sections.length; i++){
              var sectionIndex = i;
              var section = sections[i];
              var slides = $(SLIDE_SEL, section);
              var numSlides = slides.length;

              //caching the original styles to add them back on destroy('all')
              section.setAttribute('data-fp-styles', section.getAttribute('style'));

              styleSection(section, sectionIndex);
              styleMenu(section, sectionIndex);

              // if there's any slide
              if (numSlides > 0) {
                  styleSlides(section, slides, numSlides);
              }else{
                  if(options.verticalCentered){
                      addTableClass(section);
                  }
              }
          }

          //fixed elements need to be moved out of the plugin container due to problems with CSS3.
          if(options.fixedElements && options.css3){
              $(options.fixedElements).forEach(function(item){
                  $body.appendChild(item);
              });
          }

          //vertical centered of the navigation + active bullet
          if(options.navigation){
              addVerticalNavigation();
          }

          enableYoutubeAPI();

          if(options.scrollOverflow){
              scrollBarHandler = options.scrollOverflowHandler.init(options);
          }
      }

      /**
      * Styles the horizontal slides for a section.
      */
      function styleSlides(section, slides, numSlides){
          var sliderWidth = numSlides * 100;
          var slideWidth = 100 / numSlides;

          var slidesWrapper = document.createElement('div');
          slidesWrapper.className = SLIDES_WRAPPER; //fp-slides
          wrapAll(slides, slidesWrapper);

          var slidesContainer = document.createElement('div');
          slidesContainer.className = SLIDES_CONTAINER; //fp-slidesContainer
          wrapAll(slides, slidesContainer);

          css($(SLIDES_CONTAINER_SEL, section), {'width': sliderWidth + '%'});

          if(numSlides > 1){
              if(options.controlArrows){
                  createSlideArrows(section);
              }

              if(options.slidesNavigation){
                  addSlidesNavigation(section, numSlides);
              }
          }

          slides.forEach(function(slide) {
              css(slide, {'width': slideWidth + '%'});

              if(options.verticalCentered){
                  addTableClass(slide);
              }
          });

          var startingSlide = $(SLIDE_ACTIVE_SEL, section)[0];

          //if the slide won't be an starting point, the default will be the first one
          //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
          if( startingSlide != null && (index($(SECTION_ACTIVE_SEL), SECTION_SEL) !== 0 || (index($(SECTION_ACTIVE_SEL), SECTION_SEL) === 0 && index(startingSlide) !== 0))){
              silentLandscapeScroll(startingSlide, 'internal');
          }else{
              addClass(slides[0], ACTIVE);
          }
      }

      /**
      * Styling vertical sections
      */
      function styleSection(section, index){
          //if no active section is defined, the 1st one will be the default one
          if(!index && $(SECTION_ACTIVE_SEL)[0] == null) {
              addClass(section, ACTIVE);
          }
          startingSection = $(SECTION_ACTIVE_SEL)[0];

          css(section, {'height': windowsHeight + 'px'});

          if(options.paddingTop){
              css(section, {'padding-top': options.paddingTop});
          }

          if(options.paddingBottom){
              css(section, {'padding-bottom': options.paddingBottom});
          }

          if (typeof options.sectionsColor[index] !==  'undefined') {
              css(section, {'background-color': options.sectionsColor[index]});
          }

          if (typeof options.anchors[index] !== 'undefined') {
              section.setAttribute('data-anchor', options.anchors[index]);
          }
      }

      /**
      * Sets the data-anchor attributes to the menu elements and activates the current one.
      */
      function styleMenu(section, index){
          if (typeof options.anchors[index] !== 'undefined') {
              //activating the menu / nav element on load
              if(hasClass(section, ACTIVE)){
                  activateMenuAndNav(options.anchors[index], index);
              }
          }

          //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
          if(options.menu && options.css3 && closest($(options.menu)[0], WRAPPER_SEL) != null){
              $(options.menu).forEach(function(menu) {
                  $body.appendChild(menu);
              });
          }
      }

      /**
      * Adds internal classes to be able to provide customizable selectors
      * keeping the link with the style sheet.
      */
      function addInternalSelectors(){
          addClass($(options.sectionSelector, container), SECTION);
          addClass($(options.slideSelector, container), SLIDE);
      }

      /**
      * Creates the control arrows for the given section
      */
      function createSlideArrows(section){
          var arrows = [createElementFromHTML('<div class="' + SLIDES_ARROW_PREV + '"></div>'), createElementFromHTML('<div class="' + SLIDES_ARROW_NEXT + '"></div>')];
          after($(SLIDES_WRAPPER_SEL, section)[0], arrows);

          if(options.controlArrowColor !== '#fff'){
              css($(SLIDES_ARROW_NEXT_SEL, section), {'border-color': 'transparent transparent transparent '+options.controlArrowColor});
              css($(SLIDES_ARROW_PREV_SEL, section), {'border-color': 'transparent '+ options.controlArrowColor + ' transparent transparent'});
          }

          if(!options.loopHorizontal){
              hide($(SLIDES_ARROW_PREV_SEL, section));
          }
      }

      /**
      * Creates a vertical navigation bar.
      */
      function addVerticalNavigation(){
          var navigation = document.createElement('div');
          navigation.setAttribute('id', SECTION_NAV);

          var divUl = document.createElement('ul');
          navigation.appendChild(divUl);

          appendTo(navigation, $body);
          var nav = $(SECTION_NAV_SEL)[0];

          addClass(nav, 'fp-' + options.navigationPosition);

          if(options.showActiveTooltip){
              addClass(nav, SHOW_ACTIVE_TOOLTIP);
          }

          var li = '';

          for (var i = 0; i < $(SECTION_SEL).length; i++) {
              var link = '';
              if (options.anchors.length) {
                  link = options.anchors[i];
              }

              li += '<li><a href="#' + link + '"><span class="fp-sr-only">' + getBulletLinkName(i, 'Section') + '</span><span></span></a>';

              // Only add tooltip if needed (defined by user)
              var tooltip = options.navigationTooltips[i];

              if (typeof tooltip !== 'undefined' && tooltip !== '') {
                  li += '<div class="' + SECTION_NAV_TOOLTIP + ' fp-' + options.navigationPosition + '">' + tooltip + '</div>';
              }

              li += '</li>';
          }
          $('ul', nav)[0].innerHTML = li;

          //centering it vertically
          css($(SECTION_NAV_SEL), {'margin-top': '-' + ($(SECTION_NAV_SEL)[0].offsetHeight/2) + 'px'});

          //activating the current active section

          var bullet = $('li', $(SECTION_NAV_SEL)[0])[index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL)];
          addClass($('a', bullet), ACTIVE);
      }

      /**
      * Gets the name for screen readers for a section/slide navigation bullet.
      */
      function getBulletLinkName(i, defaultName){
          return options.navigationTooltips[i]
              || options.anchors[i]
              || defaultName + ' ' + (i+1);
      }

      /*
      * Enables the Youtube videos API so we can control their flow if necessary.
      */
      function enableYoutubeAPI(){
          $('iframe[src*="youtube.com/embed/"]', container).forEach(function(item){
              addURLParam(item, 'enablejsapi=1');
          });
      }

      /**
      * Adds a new parameter and its value to the `src` of a given element
      */
      function addURLParam(element, newParam){
          var originalSrc = element.getAttribute('src');
          element.setAttribute('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
      }

      /*
      * Returns the prefix sign to use for a new parameter in an existen URL.
      *
      * @return {String}  ? | &
      */
      function getUrlParamSign(url){
          return ( !/\?/.test( url ) ) ? '?' : '&';
      }

      /**
      * Actions and callbacks to fire afterRender
      */
      function afterRenderActions(){
          var section = $(SECTION_ACTIVE_SEL)[0];

          addClass(section, COMPLETELY);

          lazyLoad(section);
          lazyLoadOthers();
          playMedia(section);

          if(options.scrollOverflow){
              options.scrollOverflowHandler.afterLoad();
          }

          if(isDestinyTheStartingSection() && isFunction(options.afterLoad) ){
              fireCallback('afterLoad', {
                  activeSection: section,
                  element: section,
                  direction: null,

                  //for backwards compatibility callback (to be removed in a future!)
                  anchorLink: section.getAttribute('data-anchor'),
                  sectionIndex: index(section, SECTION_SEL)
              });
          }

          if(isFunction(options.afterRender)){
              fireCallback('afterRender');
          }
      }

      /**
      * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
      */
      function isDestinyTheStartingSection(){
          var anchor = getAnchorsURL();
          var destinationSection = getSectionByAnchor(anchor.section);
          return !anchor.section || !destinationSection || typeof destinationSection !=='undefined' && index(destinationSection) === index(startingSection);
      }

      var isScrolling = false;
      var lastScroll = 0;

      //when scrolling...
      function scrollHandler(){
          var currentSection;

          if(!options.autoScrolling || options.scrollBar){
              var currentScroll = getScrollTop();
              var scrollDirection = getScrollDirection(currentScroll);
              var visibleSectionIndex = 0;
              var screen_mid = currentScroll + (getWindowHeight() / 2.0);
              var isAtBottom = $body.offsetHeight - getWindowHeight() === currentScroll;
              var sections =  $(SECTION_SEL);

              //when using `auto-height` for a small last section it won't be centered in the viewport
              if(isAtBottom){
                  visibleSectionIndex = sections.length - 1;
              }
              //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
              else if(!currentScroll){
                  visibleSectionIndex = 0;
              }

              //taking the section which is showing more content in the viewport
              else{
                  for (var i = 0; i < sections.length; ++i) {
                      var section = sections[i];

                      // Pick the the last section which passes the middle line of the screen.
                      if (section.offsetTop <= screen_mid)
                      {
                          visibleSectionIndex = i;
                      }
                  }
              }

              if(isCompletelyInViewPort(scrollDirection)){
                  if(!hasClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY)){
                      addClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY);
                      removeClass(siblings($(SECTION_ACTIVE_SEL)[0]), COMPLETELY);
                  }
              }

              //geting the last one, the current one on the screen
              currentSection = sections[visibleSectionIndex];

              //setting the visible section as active when manually scrolling
              //executing only once the first time we reach the section
              if(!hasClass(currentSection, ACTIVE)){
                  isScrolling = true;
                  var leavingSection = $(SECTION_ACTIVE_SEL)[0];
                  var leavingSectionIndex = index(leavingSection, SECTION_SEL) + 1;
                  var yMovement = getYmovement(currentSection);
                  var anchorLink  = currentSection.getAttribute('data-anchor');
                  var sectionIndex = index(currentSection, SECTION_SEL) + 1;
                  var activeSlide = $(SLIDE_ACTIVE_SEL, currentSection)[0];
                  var slideIndex;
                  var slideAnchorLink;
                  var callbacksParams = {
                      activeSection: leavingSection,
                      sectionIndex: sectionIndex -1,
                      anchorLink: anchorLink,
                      element: currentSection,
                      leavingSection: leavingSectionIndex,
                      direction: yMovement
                  };

                  if(activeSlide){
                      slideAnchorLink = activeSlide.getAttribute('data-anchor');
                      slideIndex = index(activeSlide);
                  }

                  if(canScroll){
                      addClass(currentSection, ACTIVE);
                      removeClass(siblings(currentSection), ACTIVE);

                      if(isFunction( options.onLeave )){
                          fireCallback('onLeave', callbacksParams);
                      }
                      if(isFunction( options.afterLoad )){
                          fireCallback('afterLoad', callbacksParams);
                      }

                      stopMedia(leavingSection);
                      lazyLoad(currentSection);
                      playMedia(currentSection);

                      activateMenuAndNav(anchorLink, sectionIndex - 1);

                      if(options.anchors.length){
                          //needed to enter in hashChange event when using the menu with anchor links
                          lastScrolledDestiny = anchorLink;
                      }
                      setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                  }

                  //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                  clearTimeout(scrollId);
                  scrollId = setTimeout(function(){
                      isScrolling = false;
                  }, 100);
              }

              if(options.fitToSection){
                  //for the auto adjust of the viewport to fit a whole section
                  clearTimeout(scrollId2);

                  scrollId2 = setTimeout(function(){
                      //checking it again in case it changed during the delay
                      if(options.fitToSection &&

                          //is the destination element bigger than the viewport?
                          $(SECTION_ACTIVE_SEL)[0].offsetHeight <= windowsHeight
                      ){
                          fitToSection();
                      }
                  }, options.fitToSectionDelay);
              }
          }
      }

      /**
      * Fits the site to the nearest active section
      */
      function fitToSection(){
          //checking fitToSection again in case it was set to false before the timeout delay
          if(canScroll){
              //allows to scroll to an active section and
              //if the section is already active, we prevent firing callbacks
              isResizing = true;

              scrollPage($(SECTION_ACTIVE_SEL)[0]);
              isResizing = false;
          }
      }

      /**
      * Determines whether the active section has seen in its whole or not.
      */
      function isCompletelyInViewPort(movement){
          var top = $(SECTION_ACTIVE_SEL)[0].offsetTop;
          var bottom = top + getWindowHeight();

          if(movement == 'up'){
              return bottom >= (getScrollTop() + getWindowHeight());
          }
          return top <= getScrollTop();
      }

      /**
      * Determines whether a section is in the viewport or not.
      */
      function isSectionInViewport (el) {
          var rect = el.getBoundingClientRect();
          var top = rect.top;
          var bottom = rect.bottom;

          //sometimes there's a 1px offset on the bottom of the screen even when the
          //section's height is the window.innerHeight one. I guess because pixels won't allow decimals.
          //using this prevents from lazyLoading the section that is not yet visible
          //(only 1 pixel offset is)
          var pixelOffset = 2;

          var isTopInView = top + pixelOffset < windowsHeight && top > 0;
          var isBottomInView = bottom > pixelOffset && bottom < windowsHeight;

          return isTopInView || isBottomInView;
      }

      /**
      * Gets the directon of the the scrolling fired by the scroll event.
      */
      function getScrollDirection(currentScroll){
          var direction = currentScroll > lastScroll ? 'down' : 'up';

          lastScroll = currentScroll;

          //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
          previousDestTop = currentScroll;

          return direction;
      }

      /**
      * Determines the way of scrolling up or down:
      * by 'automatically' scrolling a section or by using the default and normal scrolling.
      */
      function scrolling(type){
          if (!isScrollAllowed.m[type]){
              return;
          }

          var scrollSection = (type === 'down') ? moveSectionDown : moveSectionUp;

          if(options.scrollOverflow){
              var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL)[0]);
              var check = (type === 'down') ? 'bottom' : 'top';

              if(scrollable != null ){
                  //is the scrollbar at the start/end of the scroll?
                  if(options.scrollOverflowHandler.isScrolled(check, scrollable)){
                      scrollSection();
                  }else{
                      return true;
                  }
              }else{
                  // moved up/down
                  scrollSection();
              }
          }else{
              // moved up/down
              scrollSection();
          }
      }

      /*
      * Preventing bouncing in iOS #2285
      */
      function preventBouncing(e){
          if(options.autoScrolling && isReallyTouch(e) && isScrollAllowed.m.up){
              //preventing the easing on iOS devices
              preventDefault(e);
          }
      }

      var touchStartY = 0;
      var touchStartX = 0;
      var touchEndY = 0;
      var touchEndX = 0;

      /* Detecting touch events

      * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
      * This way, the touchstart and the touch moves shows an small difference between them which is the
      * used one to determine the direction.
      */
      function touchMoveHandler(e){
          var activeSection = closest(e.target, SECTION_SEL) || $(SECTION_ACTIVE_SEL)[0];

          if (isReallyTouch(e) ) {

              if(options.autoScrolling){
                  //preventing the easing on iOS devices
                  preventDefault(e);
              }

              var touchEvents = getEventsPage(e);

              touchEndY = touchEvents.y;
              touchEndX = touchEvents.x;

              //if movement in the X axys is greater than in the Y and the currect section has slides...
              if ($(SLIDES_WRAPPER_SEL, activeSection).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                  //is the movement greater than the minimum resistance to scroll?
                  if (!slideMoving && Math.abs(touchStartX - touchEndX) > (getWindowWidth() / 100 * options.touchSensitivity)) {
                      if (touchStartX > touchEndX) {
                          if(isScrollAllowed.m.right){
                              moveSlideRight(activeSection); //next
                          }
                      } else {
                          if(isScrollAllowed.m.left){
                              moveSlideLeft(activeSection); //prev
                          }
                      }
                  }
              }

              //vertical scrolling (only when autoScrolling is enabled)
              else if(options.autoScrolling && canScroll){

                  //is the movement greater than the minimum resistance to scroll?
                  if (Math.abs(touchStartY - touchEndY) > (window.innerHeight / 100 * options.touchSensitivity)) {
                      if (touchStartY > touchEndY) {
                          scrolling('down');
                      } else if (touchEndY > touchStartY) {
                          scrolling('up');
                      }
                  }
              }
          }
      }

      /**
      * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
      * this way we make sure that is really a touch event what IE is detecting.
      */
      function isReallyTouch(e){
          //if is not IE   ||  IE is detecting `touch` or `pen`
          return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
      }

      /**
      * Handler for the touch start event.
      */
      function touchStartHandler(e){

          //stopping the auto scroll to adjust to a section
          if(options.fitToSection){
              activeAnimation = false;
          }

          if(isReallyTouch(e)){
              var touchEvents = getEventsPage(e);
              touchStartY = touchEvents.y;
              touchStartX = touchEvents.x;
          }
      }

      /**
      * Gets the average of the last `number` elements of the given array.
      */
      function getAverage(elements, number){
          var sum = 0;

          //taking `number` elements from the end to make the average, if there are not enought, 1
          var lastElements = elements.slice(Math.max(elements.length - number, 1));

          for(var i = 0; i < lastElements.length; i++){
              sum = sum + lastElements[i];
          }

          return Math.ceil(sum/number);
      }

      /**
       * Detecting mousewheel scrolling
       *
       * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
       * http://www.sitepoint.com/html5-javascript-mouse-wheel/
       */
      var prevTime = new Date().getTime();

      function MouseWheelHandler(e) {
          var curTime = new Date().getTime();
          var isNormalScroll = hasClass($(COMPLETELY_SEL)[0], NORMAL_SCROLL);

          //is scroll allowed?
          if (!isScrollAllowed.m.down && !isScrollAllowed.m.up) {
              preventDefault(e);
              return false;
          }

          //autoscrolling and not zooming?
          if(options.autoScrolling && !controlPressed && !isNormalScroll){
              // cross-browser wheel delta
              e = e || window.event;
              var value = e.wheelDelta || -e.deltaY || -e.detail;
              var delta = Math.max(-1, Math.min(1, value));

              var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
              var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

              //Limiting the array to 150 (lets not waste memory!)
              if(scrollings.length > 149){
                  scrollings.shift();
              }

              //keeping record of the previous scrollings
              scrollings.push(Math.abs(value));

              //preventing to scroll the site on mouse wheel when scrollbar is present
              if(options.scrollBar){
                  preventDefault(e);
              }

              //time difference between the last scroll and the current one
              var timeDiff = curTime-prevTime;
              prevTime = curTime;

              //haven't they scrolled in a while?
              //(enough to be consider a different scrolling action to scroll another section)
              if(timeDiff > 200){
                  //emptying the array, we dont care about old scrollings for our averages
                  scrollings = [];
              }

              if(canScroll){
                  var averageEnd = getAverage(scrollings, 10);
                  var averageMiddle = getAverage(scrollings, 70);
                  var isAccelerating = averageEnd >= averageMiddle;

                  //to avoid double swipes...
                  if(isAccelerating && isScrollingVertically){
                      //scrolling down?
                      if (delta < 0) {
                          scrolling('down');

                      //scrolling up?
                      }else {
                          scrolling('up');
                      }
                  }
              }

              return false;
          }

          if(options.fitToSection){
              //stopping the auto scroll to adjust to a section
              activeAnimation = false;
          }
      }

      /**
      * Slides a slider to the given direction.
      * Optional `section` param.
      */
      function moveSlide(direction, section){
          var activeSection = section == null ? $(SECTION_ACTIVE_SEL)[0] : section;
          var slides = $(SLIDES_WRAPPER_SEL, activeSection)[0];

          // more than one slide needed and nothing should be sliding
          if (slides == null || slideMoving || $(SLIDE_SEL, slides).length < 2) {
              return;
          }

          var currentSlide = $(SLIDE_ACTIVE_SEL, slides)[0];
          var destiny = null;

          if(direction === 'left'){
              destiny = prevUntil(currentSlide, SLIDE_SEL);
          }else{
              destiny = nextUntil(currentSlide, SLIDE_SEL);
          }

          //isn't there a next slide in the secuence?
          if(destiny == null){
              //respect loopHorizontal settin
              if (!options.loopHorizontal) return;

              var slideSiblings = siblings(currentSlide);
              if(direction === 'left'){
                  destiny = slideSiblings[slideSiblings.length - 1]; //last
              }else{
                  destiny = slideSiblings[0]; //first
              }
          }

          slideMoving = true && !FP.test.isTesting;
          landscapeScroll(slides, destiny, direction);
      }

      /**
      * Maintains the active slides in the viewport
      * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
      */
      function keepSlidesPosition(){
          var activeSlides = $(SLIDE_ACTIVE_SEL);
          for( var i =0; i<activeSlides.length; i++){
              silentLandscapeScroll(activeSlides[i], 'internal');
          }
      }

      var previousDestTop = 0;
      /**
      * Returns the destination Y position based on the scrolling direction and
      * the height of the section.
      */
      function getDestinationPosition(element){
          var elementHeight = element.offsetHeight;
          var elementTop = element.offsetTop;

          //top of the desination will be at the top of the viewport
          var position = elementTop;
          var isScrollingDown =  elementTop > previousDestTop;
          var sectionBottom = position - windowsHeight + elementHeight;
          var bigSectionsDestination = options.bigSectionsDestination;

          //is the destination element bigger than the viewport?
          if(elementHeight > windowsHeight){
              //scrolling up?
              if(!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom' ){
                  position = sectionBottom;
              }
          }

          //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
          else if(isScrollingDown || (isResizing && next(element) == null) ){
              //The bottom of the destination will be at the bottom of the viewport
              position = sectionBottom;
          }

          /*
          Keeping record of the last scrolled position to determine the scrolling direction.
          No conventional methods can be used as the scroll bar might not be present
          AND the section might not be active if it is auto-height and didnt reach the middle
          of the viewport.
          */
          previousDestTop = position;
          return position;
      }

      /**
      * Scrolls the site to the given element and scrolls to the slide if a callback is given.
      */
      function scrollPage(element, callback, isMovementUp){
          if(element == null){ return; } //there's no element to scroll, leaving the function

          var dtop = getDestinationPosition(element);
          var slideAnchorLink;
          var slideIndex;

          //local variables
          var v = {
              element: element,
              callback: callback,
              isMovementUp: isMovementUp,
              dtop: dtop,
              yMovement: getYmovement(element),
              anchorLink: element.getAttribute('data-anchor'),
              sectionIndex: index(element, SECTION_SEL),
              activeSlide: $(SLIDE_ACTIVE_SEL, element)[0],
              activeSection: $(SECTION_ACTIVE_SEL)[0],
              leavingSection: index($(SECTION_ACTIVE_SEL), SECTION_SEL) + 1,

              //caching the value of isResizing at the momment the function is called
              //because it will be checked later inside a setTimeout and the value might change
              localIsResizing: isResizing
          };

          //quiting when destination scroll is the same as the current one
          if((v.activeSection == element && !isResizing) || (options.scrollBar && getScrollTop() === v.dtop && !hasClass(element, AUTO_HEIGHT) )){ return; }

          if(v.activeSlide != null){
              slideAnchorLink = v.activeSlide.getAttribute('data-anchor');
              slideIndex = index(v.activeSlide);
          }

          //callback (onLeave) if the site is not just resizing and readjusting the slides
          if(!v.localIsResizing){
              var direction = v.yMovement;

              //required for continousVertical
              if(typeof isMovementUp !== 'undefined'){
                  direction = isMovementUp ? 'up' : 'down';
              }

              //for the callback
              v.direction = direction;

              if(isFunction(options.onLeave)){
                  if(fireCallback('onLeave', v) === false){
                      return;
                  }
              }
          }

          // If continuousVertical && we need to wrap around
          if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
              ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
              (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

              v = createInfiniteSections(v);
          }

          //pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)
          if(!v.localIsResizing){
              stopMedia(v.activeSection);
          }

          if(options.scrollOverflow){
              options.scrollOverflowHandler.beforeLeave();
          }

          addClass(element, ACTIVE);
          removeClass(siblings(element), ACTIVE);
          lazyLoad(element);

          if(options.scrollOverflow){
              options.scrollOverflowHandler.onLeave();
          }

          //preventing from activating the MouseWheelHandler event
          //more than once if the page is scrolling
          canScroll = false || FP.test.isTesting;

          setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

          performMovement(v);

          //flag to avoid callingn `scrollPage()` twice in case of using anchor links
          lastScrolledDestiny = v.anchorLink;

          //avoid firing it twice (as it does also on scroll)
          activateMenuAndNav(v.anchorLink, v.sectionIndex);
      }

      /**
      * Dispatch events & callbacks making sure it does it on the right format, depending on
      * whether v2compatible is being used or not.
      */
      function fireCallback(eventName, v){
          var eventData = getEventData(eventName, v);

          if(!options.v2compatible){
              trigger(container, eventName, eventData);

              if(options[eventName].apply(eventData[Object.keys(eventData)[0]], toArray(eventData)) === false){
                  return false;
              }
          }
          else{
              if(options[eventName].apply(eventData[0], eventData.slice(1)) === false){
                  return false;
              }
          }

          return true;
      }

      /**
      * Makes sure to only create a Panel object if the element exist
      */
      function nullOrSection(el){
          return el ? new Section(el) : null;
      }

      function nullOrSlide(el){
          return el ? new Slide(el) : null;
      }

      /**
      * Gets the event's data for the given event on the right format. Depending on whether
      * v2compatible is being used or not.
      */
      function getEventData(eventName, v){
          var paramsPerEvent;

          if(!options.v2compatible){

              //using functions to run only the necessary bits within the object
              paramsPerEvent = {
                  afterRender: function(){
                      return {
                          section: nullOrSection($(SECTION_ACTIVE_SEL)[0]),
                          slide: nullOrSlide($(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0])
                      };
                  },
                  onLeave: function(){
                      return {
                          origin: nullOrSection(v.activeSection),
                          destination: nullOrSection(v.element),
                          direction: v.direction
                      };
                  },

                  afterLoad: function(){
                      return paramsPerEvent.onLeave();
                  },

                  afterSlideLoad: function(){
                      return {
                          section: nullOrSection(v.section),
                          origin: nullOrSlide(v.prevSlide),
                          destination: nullOrSlide(v.destiny),
                          direction: v.direction
                      };
                  },

                  onSlideLeave: function(){
                      return paramsPerEvent.afterSlideLoad();
                  }
              };
          }
          else{
              paramsPerEvent = {
                  afterRender: function(){ return [container]; },
                  onLeave: function(){ return [v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.direction]; },
                  afterLoad: function(){ return [v.element, v.anchorLink, (v.sectionIndex + 1)]; },
                  afterSlideLoad: function(){ return [v.destiny, v.anchorLink, (v.sectionIndex + 1), v.slideAnchor, v.slideIndex]; },
                  onSlideLeave: function(){ return [v.prevSlide, v.anchorLink, (v.sectionIndex + 1), v.prevSlideIndex, v.direction, v.slideIndex]; },
              };
          }

          return paramsPerEvent[eventName]();
      }

      /**
      * Performs the vertical movement (by CSS3 or by jQuery)
      */
      function performMovement(v){
          // using CSS3 translate functionality
          if (options.css3 && options.autoScrolling && !options.scrollBar) {

              // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
              // that's why we round it to 0.
              var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
              transformContainer(translate3d, true);

              //even when the scrollingSpeed is 0 there's a little delay, which might cause the
              //scrollingSpeed to change in case of using silentMoveTo();
              if(options.scrollingSpeed){
                  clearTimeout(afterSectionLoadsId);
                  afterSectionLoadsId = setTimeout(function () {
                      afterSectionLoads(v);
                  }, options.scrollingSpeed);
              }else{
                  afterSectionLoads(v);
              }
          }

          // using JS to animate
          else{
              var scrollSettings = getScrollSettings(v.dtop);
              FP.test.top = -v.dtop + 'px';

              scrollTo(scrollSettings.element, scrollSettings.options, options.scrollingSpeed, function(){
                  if(options.scrollBar){

                      /* Hack!
                      The timeout prevents setting the most dominant section in the viewport as "active" when the user
                      scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.

                      When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                      */
                      setTimeout(function(){
                          afterSectionLoads(v);
                      },30);
                  }else{
                      afterSectionLoads(v);
                  }
              });
          }
      }

      /**
      * Gets the scrolling settings depending on the plugin autoScrolling option
      */
      function getScrollSettings(top){
          var scroll = {};

          //top property animation
          if(options.autoScrolling && !options.scrollBar){
              scroll.options = -top;
              scroll.element = $(WRAPPER_SEL)[0];
          }

          //window real scrolling
          else{
              scroll.options = top;
              scroll.element = window;
          }

          return scroll;
      }

      /**
      * Adds sections before or after the current one to create the infinite effect.
      */
      function createInfiniteSections(v){
          // Scrolling down
          if (!v.isMovementUp) {
              // Move all previous sections to after the active section
              after($(SECTION_ACTIVE_SEL)[0], prevAll(v.activeSection, SECTION_SEL).reverse());
          }
          else { // Scrolling up
              // Move all next sections to before the active section
              before($(SECTION_ACTIVE_SEL)[0], nextAll(v.activeSection, SECTION_SEL));
          }

          // Maintain the displayed position (now that we changed the element order)
          silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop);

          // Maintain the active slides visible in the viewport
          keepSlidesPosition();

          // save for later the elements that still need to be reordered
          v.wrapAroundElements = v.activeSection;

          // Recalculate animation variables
          v.dtop = v.element.offsetTop;
          v.yMovement = getYmovement(v.element);

          return v;
      }

      /**
      * Fix section order after continuousVertical changes have been animated
      */
      function continuousVerticalFixSectionOrder (v) {
          // If continuousVertical is in effect (and autoScrolling would also be in effect then),
          // finish moving the elements around so the direct navigation will function more simply
          if (v.wrapAroundElements == null) {
              return;
          }

          if (v.isMovementUp) {
              before($(SECTION_SEL)[0], v.wrapAroundElements);
          }
          else {
              after($(SECTION_SEL)[$(SECTION_SEL).length-1], v.wrapAroundElements);
          }

          silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop);

          // Maintain the active slides visible in the viewport
          keepSlidesPosition();
      }

      /**
      * Actions to do once the section is loaded.
      */
      function afterSectionLoads (v){
          continuousVerticalFixSectionOrder(v);

          //callback (afterLoad) if the site is not just resizing and readjusting the slides
          if(isFunction(options.afterLoad) && !v.localIsResizing){
              fireCallback('afterLoad', v);
          }

          if(options.scrollOverflow){
              options.scrollOverflowHandler.afterLoad();
          }

          if(!v.localIsResizing){
              playMedia(v.element);
          }

          addClass(v.element, COMPLETELY);
          removeClass(siblings(v.element), COMPLETELY);
          lazyLoadOthers();

          canScroll = true;

          if(isFunction(v.callback)){
              v.callback();
          }
      }

      /**
      * Sets the value for the given attribute from the `data-` attribute with the same suffix
      * ie: data-srcset ==> srcset  |  data-src ==> src
      */
      function setSrc(element, attribute){
          element.setAttribute(attribute, element.getAttribute('data-' + attribute));
          element.removeAttribute('data-' + attribute);
      }

      /**
      * Makes sure lazyload is done for other sections in the viewport that are not the
      * active one.
      */
      function lazyLoadOthers(){
          var hasAutoHeightSections = $(AUTO_HEIGHT_SEL)[0] || isResponsiveMode() && $(AUTO_HEIGHT_RESPONSIVE_SEL)[0];

          //quitting when it doesn't apply
          if (!options.lazyLoading || !hasAutoHeightSections){
              return;
          }

          //making sure to lazy load auto-height sections that are in the viewport
          $(SECTION_SEL + ':not(' + ACTIVE_SEL + ')').forEach(function(section){
              if(isSectionInViewport(section)){
                  lazyLoad(section);
              }
          });
      }

      /**
      * Lazy loads image, video and audio elements.
      */
      function lazyLoad(destiny){
          if (!options.lazyLoading){
              return;
          }

          var panel = getSlideOrSection(destiny);

          $('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]', panel).forEach(function(element){
              ['src', 'srcset'].forEach(function(type){
                  var attribute = element.getAttribute('data-' + type);
                  if(attribute != null && attribute){
                      setSrc(element, type);
                      element.addEventListener('load', function(){
                          onMediaLoad(destiny);
                      });
                  }
              });

              if(matches(element, 'source')){
                  var elementToPlay =  closest(element, 'video, audio');
                  if(elementToPlay){
                      elementToPlay.load();
                      elementToPlay.onloadeddata = function(){
                          onMediaLoad(destiny);
                      };
                  }
              }
          });
      }

      /**
      * Callback firing when a lazy load media element has loaded.
      * Making sure it only fires one per section in normal conditions (if load time is not huge)
      */
      function onMediaLoad(section){
          if(options.scrollOverflow){
              clearTimeout(g_mediaLoadedId);
              g_mediaLoadedId = setTimeout(function(){
                  scrollBarHandler.createScrollBar(section);
              }, 200);
          }
      }

      /**
      * Plays video and audio elements.
      */
      function playMedia(destiny){
          var panel = getSlideOrSection(destiny);

          //playing HTML5 media elements
          $('video, audio', panel).forEach(function(element){
              if( element.hasAttribute('data-autoplay') && typeof element.play === 'function' ) {
                  element.play();
              }
          });

          //youtube videos
          $('iframe[src*="youtube.com/embed/"]', panel).forEach(function(element){
              if ( element.hasAttribute('data-autoplay') ){
                  playYoutube(element);
              }

              //in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.
              element.onload = function() {
                  if ( element.hasAttribute('data-autoplay') ){
                      playYoutube(element);
                  }
              };
          });
      }

      /**
      * Plays a youtube video
      */
      function playYoutube(element){
          element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }

      /**
      * Stops video and audio elements.
      */
      function stopMedia(destiny){
          var panel = getSlideOrSection(destiny);

          //stopping HTML5 media elements
          $('video, audio', panel).forEach(function(element){
              if( !element.hasAttribute('data-keepplaying') && typeof element.pause === 'function' ) {
                  element.pause();
              }
          });

          //youtube videos
          $('iframe[src*="youtube.com/embed/"]', panel).forEach(function(element){
              if( /youtube\.com\/embed\//.test(element.getAttribute('src')) && !element.hasAttribute('data-keepplaying')){
                  element.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
              }
          });
      }

      /**
      * Gets the active slide (or section) for the given section
      */
      function getSlideOrSection(destiny){
          var slide = $(SLIDE_ACTIVE_SEL, destiny);
          if( slide.length ) {
              destiny = slide[0];
          }

          return destiny;
      }

      /**
      * Scrolls to the anchor in the URL when loading the site
      */
      function scrollToAnchor(){
          var anchors =  getAnchorsURL();
          var sectionAnchor = anchors.section;
          var slideAnchor = anchors.slide;

          if(sectionAnchor){  //if theres any #
              if(options.animateAnchor){
                  scrollPageAndSlide(sectionAnchor, slideAnchor);
              }else{
                  silentMoveTo(sectionAnchor, slideAnchor);
              }
          }
      }

      /**
      * Detecting any change on the URL to scroll to the given anchor link
      * (a way to detect back history button as we play with the hashes on the URL)
      */
      function hashChangeHandler(){
          if(!isScrolling && !options.lockAnchors){
              var anchors = getAnchorsURL();
              var sectionAnchor = anchors.section;
              var slideAnchor = anchors.slide;

              //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
              var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
              var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving);

              if(sectionAnchor && sectionAnchor.length){
                  /*in order to call scrollpage() only once for each destination at a time
                  It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                  event is fired on every scroll too.*/
                  if ((sectionAnchor && sectionAnchor !== lastScrolledDestiny) && !isFirstSlideMove
                      || isFirstScrollMove
                      || (!slideMoving && lastScrolledSlide != slideAnchor )){

                      scrollPageAndSlide(sectionAnchor, slideAnchor);
                  }
              }
          }
      }

      //gets the URL anchors (section and slide)
      function getAnchorsURL(){
          var section;
          var slide;
          var hash = window.location.hash;

          if(hash.length){
              //getting the anchor link in the URL and deleting the `#`
              var anchorsParts =  hash.replace('#', '').split('/');

              //using / for visual reasons and not as a section/slide separator #2803
              var isFunkyAnchor = hash.indexOf('#/') > -1;

              section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);

              var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];
              if(slideAnchor && slideAnchor.length){
                  slide = decodeURIComponent(slideAnchor);
              }
          }

          return {
              section: section,
              slide: slide
          };
      }

      //Sliding with arrow keys, both, vertical and horizontal
      function keydownHandler(e) {
          clearTimeout(keydownId);

          var activeElement = document.activeElement;
          var keyCode = e.keyCode;

          //tab?
          if(keyCode === 9){
              onTab(e);
          }

          else if(!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select') &&
              activeElement.getAttribute('contentEditable') !== "true" && activeElement.getAttribute('contentEditable') !== '' &&
              options.keyboardScrolling && options.autoScrolling){

              //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
              var keyControls = [40, 38, 32, 33, 34];
              if(keyControls.indexOf(keyCode) > -1){
                  preventDefault(e);
              }

              controlPressed = e.ctrlKey;

              keydownId = setTimeout(function(){
                  onkeydown(e);
              },150);
          }
      }

      function tooltipTextHandler(){
          /*jshint validthis:true */
          trigger(prev(this), 'click');
      }

      //to prevent scrolling while zooming
      function keyUpHandler(e){
          if(isWindowFocused){ //the keyup gets fired on new tab ctrl + t in Firefox
              controlPressed = e.ctrlKey;
          }
      }

      //binding the mousemove when the mouse's middle button is released
      function mouseDownHandler(e){
          //middle button
          if (e.which == 2){
              oldPageY = e.pageY;
              container.addEventListener('mousemove', mouseMoveHandler);
          }
      }

      //unbinding the mousemove when the mouse's middle button is released
      function mouseUpHandler(e){
          //middle button
          if (e.which == 2){
              container.removeEventListener('mousemove', mouseMoveHandler);
          }
      }

      /**
      * Makes sure the tab key will only focus elements within the current section/slide
      * preventing this way from breaking the page.
      * Based on "Modals and keyboard traps"
      * from https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
      */
      function onTab(e){
          var isShiftPressed = e.shiftKey;
          var activeElement = document.activeElement;
          var focusableElements = getFocusables(getSlideOrSection($(SECTION_ACTIVE_SEL)[0]));

          function preventAndFocusFirst(e){
              preventDefault(e);
              return focusableElements[0] ? focusableElements[0].focus() : null;
          }

          //outside any section or slide? Let's not hijack the tab!
          if(isFocusOutside(e)){
              return;
          }

          //is there an element with focus?
          if(activeElement){
              if(closest(activeElement, SECTION_ACTIVE_SEL + ',' + SECTION_ACTIVE_SEL + ' ' + SLIDE_ACTIVE_SEL) == null){
                  activeElement = preventAndFocusFirst(e);
              }
          }

          //no element if focused? Let's focus the first one of the section/slide
          else{
              preventAndFocusFirst(e);
          }

          //when reached the first or last focusable element of the section/slide
          //we prevent the tab action to keep it in the last focusable element
          if(!isShiftPressed && activeElement == focusableElements[focusableElements.length - 1] ||
              isShiftPressed && activeElement == focusableElements[0]
          ){
              preventDefault(e);
          }
      }

      /**
      * Gets all the focusable elements inside the passed element.
      */
      function getFocusables(el){
          return [].slice.call($(focusableElementsString, el)).filter(function(item) {
                  return item.getAttribute('tabindex') !== '-1'
                  //are also not hidden elements (or with hidden parents)
                  && item.offsetParent !== null;
          });
      }

      /**
      * Determines whether the focus is outside fullpage.js sections/slides or not.
      */
      function isFocusOutside(e){
          var allFocusables = getFocusables(document);
          var currentFocusIndex = allFocusables.indexOf(document.activeElement);
          var focusDestinationIndex = e.shiftKey ? currentFocusIndex - 1 : currentFocusIndex + 1;
          var focusDestination = allFocusables[focusDestinationIndex];
          var destinationItemSlide = nullOrSlide(closest(focusDestination, SLIDE_SEL));
          var destinationItemSection = nullOrSection(closest(focusDestination, SECTION_SEL));

          return !destinationItemSlide && !destinationItemSection;
      }

      //Scrolling horizontally when clicking on the slider controls.
      function slideArrowHandler(){
          /*jshint validthis:true */
          var section = closest(this, SECTION_SEL);

          /*jshint validthis:true */
          if (hasClass(this, SLIDES_PREV)) {
              if(isScrollAllowed.m.left){
                  moveSlideLeft(section);
              }
          } else {
              if(isScrollAllowed.m.right){
                  moveSlideRight(section);
              }
          }
      }

      //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
      function blurHandler(){
          isWindowFocused = false;
          controlPressed = false;
      }

      //Scrolls to the section when clicking the navigation bullet
      function sectionBulletHandler(e){
          preventDefault(e);

          /*jshint validthis:true */
          var indexBullet = index(closest(this, SECTION_NAV_SEL + ' li'));
          scrollPage($(SECTION_SEL)[indexBullet]);
      }

      //Scrolls the slider to the given slide destination for the given section
      function slideBulletHandler(e){
          preventDefault(e);

          /*jshint validthis:true */
          var slides = $(SLIDES_WRAPPER_SEL, closest(this, SECTION_SEL))[0];
          var destiny = $(SLIDE_SEL, slides)[index(closest(this, 'li'))];

          landscapeScroll(slides, destiny);
      }

      //Menu item handler when not using anchors or using lockAnchors:true
      function menuItemsHandler(e){
          if($(options.menu)[0] && (options.lockAnchors || !options.anchors.length)){
              preventDefault(e);
              /*jshint validthis:true */
              moveTo(this.getAttribute('data-menuanchor'));
          }
      }

      /**
      * Keydown event
      */
      function onkeydown(e){
          var shiftPressed = e.shiftKey;
          var activeElement = document.activeElement;
          var isMediaFocused = matches(activeElement, 'video') || matches(activeElement, 'audio');

          //do nothing if we can not scroll or we are not using horizotnal key arrows.
          if(!canScroll && [37,39].indexOf(e.keyCode) < 0){
              return;
          }

          switch (e.keyCode) {
              //up
              case 38:
              case 33:
                  if(isScrollAllowed.k.up){
                      moveSectionUp();
                  }
                  break;

              //down
              case 32: //spacebar

                  if(shiftPressed && isScrollAllowed.k.up && !isMediaFocused){
                      moveSectionUp();
                      break;
                  }
              /* falls through */
              case 40:
              case 34:
                  if(isScrollAllowed.k.down){
                      // space bar?
                      if(e.keyCode !== 32 || !isMediaFocused){
                          moveSectionDown();
                      }
                  }
                  break;

              //Home
              case 36:
                  if(isScrollAllowed.k.up){
                      moveTo(1);
                  }
                  break;

              //End
              case 35:
                   if(isScrollAllowed.k.down){
                      moveTo( $(SECTION_SEL).length );
                  }
                  break;

              //left
              case 37:
                  if(isScrollAllowed.k.left){
                      moveSlideLeft();
                  }
                  break;

              //right
              case 39:
                  if(isScrollAllowed.k.right){
                      moveSlideRight();
                  }
                  break;

              default:
                  return; // exit this handler for other keys
          }
      }

      /**
      * Detecting the direction of the mouse movement.
      * Used only for the middle button of the mouse.
      */
      var oldPageY = 0;
      function mouseMoveHandler(e){
          if(!options.autoScrolling){
              return;
          }
          if(canScroll){
              // moving up
              if (e.pageY < oldPageY && isScrollAllowed.m.up){
                  moveSectionUp();
              }

              // moving down
              else if(e.pageY > oldPageY && isScrollAllowed.m.down){
                  moveSectionDown();
              }
          }
          oldPageY = e.pageY;
      }

      /**
      * Scrolls horizontal sliders.
      */
      function landscapeScroll(slides, destiny, direction){
          var section = closest(slides, SECTION_SEL);
          var v = {
              slides: slides,
              destiny: destiny,
              direction: direction,
              destinyPos: {left: destiny.offsetLeft},
              slideIndex: index(destiny),
              section: section,
              sectionIndex: index(section, SECTION_SEL),
              anchorLink: section.getAttribute('data-anchor'),
              slidesNav: $(SLIDES_NAV_SEL, section)[0],
              slideAnchor: getAnchor(destiny),
              prevSlide: $(SLIDE_ACTIVE_SEL, section)[0],
              prevSlideIndex: index($(SLIDE_ACTIVE_SEL, section)[0]),

              //caching the value of isResizing at the momment the function is called
              //because it will be checked later inside a setTimeout and the value might change
              localIsResizing: isResizing
          };
          v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);
          v.direction = v.direction ? v.direction : v.xMovement;

          //important!! Only do it when not resizing
          if(!v.localIsResizing){
              //preventing from scrolling to the next/prev section when using scrollHorizontally
              canScroll = false;
          }

          if(options.onSlideLeave){

              //if the site is not just resizing and readjusting the slides
              if(!v.localIsResizing && v.xMovement!=='none'){
                  if(isFunction( options.onSlideLeave )){
                      if( fireCallback('onSlideLeave', v) === false){
                          slideMoving = false;
                          return;
                      }
                  }
              }
          }

          addClass(destiny, ACTIVE);
          removeClass(siblings(destiny), ACTIVE);

          if(!v.localIsResizing){
              stopMedia(v.prevSlide);
              lazyLoad(destiny);
          }

          if(!options.loopHorizontal && options.controlArrows){
              //hidding it for the fist slide, showing for the rest
              toggle($(SLIDES_ARROW_PREV_SEL, section), v.slideIndex!==0);

              //hidding it for the last slide, showing for the rest
              toggle($(SLIDES_ARROW_NEXT_SEL, section), next(destiny) != null);
          }

          //only changing the URL if the slides are in the current section (not for resize re-adjusting)
          if(hasClass(section, ACTIVE) && !v.localIsResizing){
              setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
          }

          performHorizontalMove(slides, v, true);
      }


      function afterSlideLoads(v){
          activeSlidesNavigation(v.slidesNav, v.slideIndex);

          //if the site is not just resizing and readjusting the slides
          if(!v.localIsResizing){
              if(isFunction( options.afterSlideLoad )){
                  fireCallback('afterSlideLoad', v);
              }

              //needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally
              //and to prevent double scroll right after a windows resize
              canScroll = true;

              playMedia(v.destiny);
          }

          //letting them slide again
          slideMoving = false;
      }

      /**
      * Performs the horizontal movement. (CSS3 or jQuery)
      *
      * @param fireCallback {Bool} - determines whether or not to fire the callback
      */
      function performHorizontalMove(slides, v, fireCallback){
          var destinyPos = v.destinyPos;

          if(options.css3){
              var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

              FP.test.translate3dH[v.sectionIndex] = translate3d;
              css(addAnimation($(SLIDES_CONTAINER_SEL, slides)), getTransforms(translate3d));

              afterSlideLoadsId = setTimeout(function(){
                  if(fireCallback){
                      afterSlideLoads(v);
                  }
              }, options.scrollingSpeed);
          }else{
              FP.test.left[v.sectionIndex] = Math.round(destinyPos.left);

              scrollTo(slides, Math.round(destinyPos.left), options.scrollingSpeed, function(){
                  if(fireCallback){
                      afterSlideLoads(v);
                  }
              });
          }
      }

      /**
      * Sets the state for the horizontal bullet navigations.
      */
      function activeSlidesNavigation(slidesNav, slideIndex){
          if(options.slidesNavigation && slidesNav != null){
              removeClass($(ACTIVE_SEL, slidesNav), ACTIVE);
              addClass( $('a', $('li', slidesNav)[slideIndex] ), ACTIVE);
          }
      }

      var previousHeight = windowsHeight;

      /*
      * Resize event handler.
      */
      function resizeHandler(){
          clearTimeout(resizeId);

          //in order to call the functions only when the resize is finished
          //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
          resizeId = setTimeout(function(){

              //issue #3336
              //(some apps or browsers, like Chrome/Firefox for Mobile take time to report the real height)
              //so we check it 3 times with intervals in that case
              for(var i = 0; i< 4; i++){
                  resizeHandlerId = setTimeout(resizeActions, 200 * i);
              }
          }, 200);
      }

      /**
      * When resizing the site, we adjust the heights of the sections, slimScroll...
      */
      function resizeActions(){

          //checking if it needs to get responsive
          responsive();

          // rebuild immediately on touch devices
          if (isTouchDevice) {
              var activeElement = document.activeElement;

              //if the keyboard is NOT visible
              if (!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select')) {
                  var currentHeight = getWindowHeight();

                  //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                  if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                      reBuild(true);
                      previousHeight = currentHeight;
                  }
              }
          }
          else{
              adjustToNewViewport();
          }
      }

      /**
      * Checks if the site needs to get responsive and disables autoScrolling if so.
      * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
      */
      function responsive(){
          var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
          var heightLimit = options.responsiveHeight;

          //only calculating what we need. Remember its called on the resize event.
          var isBreakingPointWidth = widthLimit && window.innerWidth < widthLimit;
          var isBreakingPointHeight = heightLimit && window.innerHeight < heightLimit;

          if(widthLimit && heightLimit){
              setResponsive(isBreakingPointWidth || isBreakingPointHeight);
          }
          else if(widthLimit){
              setResponsive(isBreakingPointWidth);
          }
          else if(heightLimit){
              setResponsive(isBreakingPointHeight);
          }
      }

      /**
      * Adds transition animations for the given element
      */
      function addAnimation(element){
          var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

          removeClass(element, NO_TRANSITION);
          return css(element, {
              '-webkit-transition': transition,
              'transition': transition
          });
      }

      /**
      * Remove transition animations for the given element
      */
      function removeAnimation(element){
          return addClass(element, NO_TRANSITION);
      }

      /**
      * Activating the vertical navigation bullets according to the given slide name.
      */
      function activateNavDots(name, sectionIndex){
          if(options.navigation && $(SECTION_NAV_SEL)[0] != null){
                  removeClass($(ACTIVE_SEL, $(SECTION_NAV_SEL)[0]), ACTIVE);
              if(name){
                  addClass( $('a[href="#' + name + '"]', $(SECTION_NAV_SEL)[0]), ACTIVE);
              }else{
                  addClass($('a', $('li', $(SECTION_NAV_SEL)[0])[sectionIndex]), ACTIVE);
              }
          }
      }

      /**
      * Activating the website main menu elements according to the given slide name.
      */
      function activateMenuElement(name){
          $(options.menu).forEach(function(menu) {
              if(options.menu && menu != null){
                  removeClass($(ACTIVE_SEL, menu), ACTIVE);
                  addClass($('[data-menuanchor="'+name+'"]', menu), ACTIVE);
              }
          });
      }

      /**
      * Sets to active the current menu and vertical nav items.
      */
      function activateMenuAndNav(anchor, index){
          activateMenuElement(anchor);
          activateNavDots(anchor, index);
      }

      /**
      * Retuns `up` or `down` depending on the scrolling movement to reach its destination
      * from the current section.
      */
      function getYmovement(destiny){
          var fromIndex = index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);
          var toIndex = index(destiny, SECTION_SEL);
          if( fromIndex == toIndex){
              return 'none';
          }
          if(fromIndex > toIndex){
              return 'up';
          }
          return 'down';
      }

      /**
      * Retuns `right` or `left` depending on the scrolling movement to reach its destination
      * from the current slide.
      */
      function getXmovement(fromIndex, toIndex){
          if( fromIndex == toIndex){
              return 'none';
          }
          if(fromIndex > toIndex){
              return 'left';
          }
          return 'right';
      }

      function addTableClass(element){
          //In case we are styling for the 2nd time as in with reponsiveSlides
          if(!hasClass(element, TABLE)){
              var wrapper = document.createElement('div');
              wrapper.className = TABLE_CELL;
              wrapper.style.height = getTableHeight(element) + 'px';

              addClass(element, TABLE);
              wrapInner(element, wrapper);
          }
      }

      function getTableHeight(element){
          var sectionHeight = windowsHeight;

          if(options.paddingTop || options.paddingBottom){
              var section = element;
              if(!hasClass(section, SECTION)){
                  section = closest(element, SECTION_SEL);
              }

              var paddings = parseInt(getComputedStyle(section)['padding-top']) + parseInt(getComputedStyle(section)['padding-bottom']);
              sectionHeight = (windowsHeight - paddings);
          }

          return sectionHeight;
      }

      /**
      * Adds a css3 transform property to the container class with or without animation depending on the animated param.
      */
      function transformContainer(translate3d, animated){
          if(animated){
              addAnimation(container);
          }else{
              removeAnimation(container);
          }

          css(container, getTransforms(translate3d));
          FP.test.translate3d = translate3d;

          //syncronously removing the class after the animation has been applied.
          setTimeout(function(){
              removeClass(container, NO_TRANSITION);
          },10);
      }

      /**
      * Gets a section by its anchor / index
      */
      function getSectionByAnchor(sectionAnchor){
          var section = $(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]', container)[0];
          if(!section){
              var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor -1 : 0;
              section = $(SECTION_SEL)[sectionIndex];
          }

          return section;
      }

      /**
      * Gets a slide inside a given section by its anchor / index
      */
      function getSlideByAnchor(slideAnchor, section){
          var slide = $(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]', section)[0];
          if(slide == null){
              slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
              slide = $(SLIDE_SEL, section)[slideAnchor];
          }

          return slide;
      }

      /**
      * Scrolls to the given section and slide anchors
      */
      function scrollPageAndSlide(sectionAnchor, slideAnchor){
          var section = getSectionByAnchor(sectionAnchor);

          //do nothing if there's no section with the given anchor name
          if(section == null) return;

          var slide = getSlideByAnchor(slideAnchor, section);

          //we need to scroll to the section and then to the slide
          if (getAnchor(section) !== lastScrolledDestiny && !hasClass(section, ACTIVE)){
              scrollPage(section, function(){
                  scrollSlider(slide);
              });
          }
          //if we were already in the section
          else{
              scrollSlider(slide);
          }
      }

      /**
      * Scrolls the slider to the given slide destination for the given section
      */
      function scrollSlider(slide){
          if(slide != null){
              landscapeScroll(closest(slide, SLIDES_WRAPPER_SEL), slide);
          }
      }

      /**
      * Creates a landscape navigation bar with dots for horizontal sliders.
      */
      function addSlidesNavigation(section, numSlides){
          appendTo(createElementFromHTML('<div class="' + SLIDES_NAV + '"><ul></ul></div>'), section);
          var nav = $(SLIDES_NAV_SEL, section)[0];

          //top or bottom
          addClass(nav, 'fp-' + options.slidesNavPosition);

          for(var i=0; i< numSlides; i++){
              appendTo(createElementFromHTML('<li><a href="#"><span class="fp-sr-only">'+ getBulletLinkName(i, 'Slide') +'</span><span></span></a></li>'), $('ul', nav)[0] );
          }

          //centering it
          css(nav, {'margin-left': '-' + (nav.innerWidth/2) + 'px'});

          addClass($('a', $('li', nav)[0] ), ACTIVE);
      }


      /**
      * Sets the state of the website depending on the active section/slide.
      * It changes the URL hash when needed and updates the body class.
      */
      function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
          var sectionHash = '';

          if(options.anchors.length && !options.lockAnchors){

              //isn't it the first slide?
              if(slideIndex){
                  if(anchorLink != null){
                      sectionHash = anchorLink;
                  }

                  //slide without anchor link? We take the index instead.
                  if(slideAnchor == null){
                      slideAnchor = slideIndex;
                  }

                  lastScrolledSlide = slideAnchor;
                  setUrlHash(sectionHash + '/' + slideAnchor);

              //first slide won't have slide anchor, just the section one
              }else if(slideIndex != null){
                  lastScrolledSlide = slideAnchor;
                  setUrlHash(anchorLink);
              }

              //section without slides
              else{
                  setUrlHash(anchorLink);
              }
          }

          setBodyClass();
      }

      /**
      * Sets the URL hash.
      */
      function setUrlHash(url){
          if(options.recordHistory){
              location.hash = url;
          }else{
              //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
              if(isTouchDevice || isTouch){
                  window.history.replaceState(undefined, undefined, '#' + url);
              }else{
                  var baseUrl = window.location.href.split('#')[0];
                  window.location.replace( baseUrl + '#' + url );
              }
          }
      }

      /**
      * Gets the anchor for the given slide / section. Its index will be used if there's none.
      */
      function getAnchor(element){
          if(!element){
              return null;
          }
          var anchor = element.getAttribute('data-anchor');
          var elementIndex = index(element);

          //Slide without anchor link? We take the index instead.
          if(anchor == null){
              anchor = elementIndex;
          }

          return anchor;
      }

      /**
      * Sets a class for the body of the page depending on the active section / slide
      */
      function setBodyClass(){
          var section = $(SECTION_ACTIVE_SEL)[0];
          var slide = $(SLIDE_ACTIVE_SEL, section)[0];

          var sectionAnchor = getAnchor(section);
          var slideAnchor = getAnchor(slide);

          var text = String(sectionAnchor);

          if(slide){
              text = text + '-' + slideAnchor;
          }

          //changing slash for dash to make it a valid CSS style
          text = text.replace('/', '-').replace('#','');

          //removing previous anchor classes
          var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
          $body.className = $body.className.replace(classRe, '');

          //adding the current anchor
          addClass($body, VIEWING_PREFIX + '-' + text);
      }

      /**
      * Checks for translate3d support
      * @return boolean
      * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
      */
      function support3d() {
          var el = document.createElement('p'),
              has3d,
              transforms = {
                  'webkitTransform':'-webkit-transform',
                  'OTransform':'-o-transform',
                  'msTransform':'-ms-transform',
                  'MozTransform':'-moz-transform',
                  'transform':'transform'
              };

          //preventing the style p:empty{display: none;} from returning the wrong result
          el.style.display = 'block';

          // Add it to the body to get the computed style.
          document.body.insertBefore(el, null);

          for (var t in transforms) {
              if (el.style[t] !== undefined) {
                  el.style[t] = 'translate3d(1px,1px,1px)';
                  has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
              }
          }

          document.body.removeChild(el);

          return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
      }

      /**
      * Removes the auto scrolling action fired by the mouse wheel and trackpad.
      * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
      */
      function removeMouseWheelHandler(){
          if (document.addEventListener) {
              document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
              document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
              document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
          } else {
              document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
          }
      }

      /**
      * Adds the auto scrolling action for the mouse wheel and trackpad.
      * After this function is called, the mousewheel and trackpad movements will scroll through sections
      * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
      */
      function addMouseWheelHandler(){
          var prefix = '';
          var _addEventListener;

          if (window.addEventListener){
              _addEventListener = "addEventListener";
          }else{
              _addEventListener = "attachEvent";
              prefix = 'on';
          }

          // detect available wheel event
          var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
                    document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox
          var passiveEvent = g_supportsPassive ? {passive: false }: false;

          if(support == 'DOMMouseScroll'){
              document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, passiveEvent);
          }

          //handle MozMousePixelScroll in older Firefox
          else{
              document[ _addEventListener ](prefix + support, MouseWheelHandler, passiveEvent);
          }
      }

      /**
      * Binding the mousemove when the mouse's middle button is pressed
      */
      function addMiddleWheelHandler(){
          container.addEventListener('mousedown', mouseDownHandler);
          container.addEventListener('mouseup', mouseUpHandler);
      }

      /**
      * Unbinding the mousemove when the mouse's middle button is released
      */
      function removeMiddleWheelHandler(){
          container.removeEventListener('mousedown', mouseDownHandler);
          container.removeEventListener('mouseup', mouseUpHandler);
      }

      /**
      * Adds the possibility to auto scroll through sections on touch devices.
      */
      function addTouchHandler(){
          if(isTouchDevice || isTouch){
              if(options.autoScrolling){
                  $body.removeEventListener(events.touchmove, preventBouncing, {passive: false});
                  $body.addEventListener(events.touchmove, preventBouncing, {passive: false});
              }

              var touchWrapper = options.touchWrapper;
              touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
              touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});

              touchWrapper.addEventListener(events.touchstart, touchStartHandler);
              touchWrapper.addEventListener(events.touchmove, touchMoveHandler, {passive: false});
          }
      }

      /**
      * Removes the auto scrolling for touch devices.
      */
      function removeTouchHandler(){
          if(isTouchDevice || isTouch){
              // normalScrollElements requires it off #2691
              if(options.autoScrolling){
                  $body.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});
                  $body.removeEventListener(events.touchmove, preventBouncing, {passive: false});
              }

              var touchWrapper = options.touchWrapper;
              touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
              touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});
          }
      }

      /*
      * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
      * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
      */
      function getMSPointer(){
          var pointer;

          //IE >= 11 & rest of browsers
          if(window.PointerEvent){
              pointer = { down: 'pointerdown', move: 'pointermove'};
          }

          //IE < 11
          else{
              pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
          }

          return pointer;
      }

      /**
      * Gets the pageX and pageY properties depending on the browser.
      * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
      */
      function getEventsPage(e){
          var events = [];

          events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
          events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

          //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008
          if(isTouch && isReallyTouch(e) && options.scrollBar && typeof e.touches !== 'undefined'){
              events.y = e.touches[0].pageY;
              events.x = e.touches[0].pageX;
          }

          return events;
      }

      /**
      * Slides silently (with no animation) the active slider to the given slide.
      * @param noCallback {bool} true or defined -> no callbacks
      */
      function silentLandscapeScroll(activeSlide, noCallbacks){
          setScrollingSpeed(0, 'internal');

          if(typeof noCallbacks !== 'undefined'){
              //preventing firing callbacks afterSlideLoad etc.
              isResizing = true;
          }

          landscapeScroll(closest(activeSlide, SLIDES_WRAPPER_SEL), activeSlide);

          if(typeof noCallbacks !== 'undefined'){
              isResizing = false;
          }

          setScrollingSpeed(originals.scrollingSpeed, 'internal');
      }

      /**
      * Scrolls silently (with no animation) the page to the given Y position.
      */
      function silentScroll(top){
          // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
          // that's why we round it to 0.
          var roundedTop = Math.round(top);

          if (options.css3 && options.autoScrolling && !options.scrollBar){
              var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
              transformContainer(translate3d, false);
          }
          else if(options.autoScrolling && !options.scrollBar){
              css(container, {'top': -roundedTop + 'px'});
              FP.test.top = -roundedTop + 'px';
          }
          else{
              var scrollSettings = getScrollSettings(roundedTop);
              setScrolling(scrollSettings.element, scrollSettings.options);
          }
      }

      /**
      * Returns the cross-browser transform string.
      */
      function getTransforms(translate3d){
          return {
              '-webkit-transform': translate3d,
              '-moz-transform': translate3d,
              '-ms-transform':translate3d,
              'transform': translate3d
          };
      }

      /**
      * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
      * @type  m (mouse) or k (keyboard)
      */
      function setIsScrollAllowed(value, direction, type){
          //up, down, left, right
          if(direction !== 'all'){
              isScrollAllowed[type][direction] = value;
          }

          //all directions?
          else{
              Object.keys(isScrollAllowed[type]).forEach(function(key){
                  isScrollAllowed[type][key] = value;
              });
          }
      }

      /*
      * Destroys fullpage.js plugin events and optinally its html markup and styles
      */
      function destroy(all){
          setAutoScrolling(false, 'internal');
          setAllowScrolling(true);
          setMouseHijack(false);
          setKeyboardScrolling(false);
          addClass(container, DESTROYED);

          [
              afterSlideLoadsId,
              afterSectionLoadsId,
              resizeId,
              scrollId,
              scrollId2,
              g_doubleCheckHeightId,
              resizeHandlerId
          ].forEach(function(timeoutId){
              clearTimeout(timeoutId);
          });

          window.removeEventListener('scroll', scrollHandler);
          window.removeEventListener('hashchange', hashChangeHandler);
          window.removeEventListener('resize', resizeHandler);

          document.removeEventListener('keydown', keydownHandler);
          document.removeEventListener('keyup', keyUpHandler);

          ['click', 'touchstart'].forEach(function(eventName){
              document.removeEventListener(eventName, delegatedEvents);
          });

          ['mouseenter', 'touchstart', 'mouseleave', 'touchend'].forEach(function(eventName){
              document.removeEventListener(eventName, onMouseEnterOrLeave, true); //true is required!
          });

          //lets make a mess!
          if(all){
              destroyStructure();
          }
      }

      /*
      * Removes inline styles added by fullpage.js
      */
      function destroyStructure(){
          //reseting the `top` or `translate` properties to 0
          silentScroll(0);

          //loading all the lazy load content
          $('img[data-src], source[data-src], audio[data-src], iframe[data-src]', container).forEach(function(item){
              setSrc(item, 'src');
          });

          $('img[data-srcset]').forEach(function(item){
              setSrc(item, 'srcset');
          });

          remove($(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL));

          //removing inline styles
          css($(SECTION_SEL), {
              'height': '',
              'background-color' : '',
              'padding': ''
          });

          css($(SLIDE_SEL), {
              'width': ''
          });

          css(container, {
              'height': '',
              'position': '',
              '-ms-touch-action': '',
              'touch-action': ''
          });

          css($htmlBody, {
              'overflow': '',
              'height': ''
          });

          // remove .fp-enabled class
          removeClass($html, ENABLED);

          // remove .fp-responsive class
          removeClass($body, RESPONSIVE);

          // remove all of the .fp-viewing- classes
          $body.className.split(/\s+/).forEach(function (className) {
              if (className.indexOf(VIEWING_PREFIX) === 0) {
                  removeClass($body, className);
              }
          });

          //removing added classes
          $(SECTION_SEL + ', ' + SLIDE_SEL).forEach(function(item){
              if(options.scrollOverflowHandler && options.scrollOverflow){
                  options.scrollOverflowHandler.remove(item);
              }
              removeClass(item, TABLE + ' ' + ACTIVE + ' ' + COMPLETELY);
              var previousStyles = item.getAttribute('data-fp-styles');
              if(previousStyles){
                  item.setAttribute('style', item.getAttribute('data-fp-styles'));
              }

              //removing anchors if they were not set using the HTML markup
              if(hasClass(item, SECTION) && !g_initialAnchorsInDom){
                  item.removeAttribute('data-anchor');
              }
          });

          //removing the applied transition from the fullpage wrapper
          removeAnimation(container);

          //Unwrapping content
          [TABLE_CELL_SEL, SLIDES_CONTAINER_SEL,SLIDES_WRAPPER_SEL].forEach(function(selector){
              $(selector, container).forEach(function(item){
                  //unwrap not being use in case there's no child element inside and its just text
                  unwrap(item);
              });
          });

          //removing the applied transition from the fullpage wrapper
          css(container, {
              '-webkit-transition': 'none',
              'transition': 'none'
          });

          //scrolling the page to the top with no animation
          window.scrollTo(0, 0);

          //removing selectors
          var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
          usedSelectors.forEach(function(item){
              removeClass($('.' + item), item);
          });
      }

      /*
      * Sets the state for a variable with multiple states (original, and temporal)
      * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
      * This function is used to keep track of both states, the original and the temporal one.
      * If type is not 'internal', then we assume the user is globally changing the variable.
      */
      function setVariableState(variable, value, type){
          options[variable] = value;
          if(type !== 'internal'){
              originals[variable] = value;
          }
      }

      /**
      * Displays warnings
      */
      function displayWarnings(){
          var l = options['li' + 'c' + 'enseK' + 'e' + 'y'];
          var msgStyle = 'font-size: 15px;background:yellow;';

          if(hasClass($html, ENABLED)){
              showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
              return;
          }

          // Disable mutually exclusive settings
          if (options.continuousVertical &&
              (options.loopTop || options.loopBottom)) {
              options.continuousVertical = false;
              showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
          }

          if(options.scrollOverflow &&
             (options.scrollBar || !options.autoScrolling)){
              showError('warn', 'Options scrollBar:true and autoScrolling:false are mutually exclusive with scrollOverflow:true. Sections with scrollOverflow might not work well in Firefox');
          }

          if(options.continuousVertical && (options.scrollBar || !options.autoScrolling)){
              options.continuousVertical = false;
              showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
          }

          if(options.scrollOverflow && options.scrollOverflowHandler == null){
              options.scrollOverflow = false;
              showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
          }

          //using extensions? Wrong file!
          extensions.forEach(function(extension){
              //is the option set to true?
              if(options[extension]){
                  showError('warn', 'fullpage.js extensions require fullpage.extensions.min.js file instead of the usual fullpage.js. Requested: '+ extension);
              }
          });

          //anchors can not have the same value as any element ID or NAME
          options.anchors.forEach(function(name){

              //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
              var nameAttr = [].slice.call($('[name]')).filter(function(item) {
                  return item.getAttribute('name') && item.getAttribute('name').toLowerCase() == name.toLowerCase();
              });

              var idAttr = [].slice.call($('[id]')).filter(function(item) {
                  return item.getAttribute('id') && item.getAttribute('id').toLowerCase() == name.toLowerCase();
              });

              if(idAttr.length || nameAttr.length ){
                  showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                  var propertyName = idAttr.length ? 'id' : 'name';

                  if(idAttr.length || nameAttr.length){
                      showError('error', '"' + name + '" is is being used by another element `'+ propertyName +'` property');
                  }
              }
          });
      }

      /**
      * Getting the position of the element to scroll when using jQuery animations
      */
      function getScrolledPosition(element){
          var position;

          //is not the window element and is a slide?
          if(element.self != window && hasClass(element, SLIDES_WRAPPER)){
              position = element.scrollLeft;
          }
          else if(!options.autoScrolling  || options.scrollBar){
              position = getScrollTop();
          }
          else{
              position = element.offsetTop;
          }

          //gets the top property of the wrapper
          return position;
      }

      /**
      * Simulates the animated scrollTop of jQuery. Used when css3:false or scrollBar:true or autoScrolling:false
      * http://stackoverflow.com/a/16136789/1081396
      */
      function scrollTo(element, to, duration, callback) {
          var start = getScrolledPosition(element);
          var change = to - start;
          var currentTime = 0;
          var increment = 20;
          activeAnimation = true;

          var animateScroll = function(){
              if(activeAnimation){ //in order to stope it from other function whenever we want
                  var val = to;

                  currentTime += increment;

                  if(duration){
                      val = window.fp_easings[options.easing](currentTime, start, change, duration);
                  }

                  setScrolling(element, val);

                  if(currentTime < duration) {
                      setTimeout(animateScroll, increment);
                  }else if(typeof callback !== 'undefined'){
                      callback();
                  }
              }else if (currentTime < duration){
                  callback();
              }
          };

          animateScroll();
      }

      /**
      * Scrolls the page / slider the given number of pixels.
      * It will do it one or another way dependiong on the library's config.
      */
      function setScrolling(element, val){
          if(!options.autoScrolling || options.scrollBar || (element.self != window && hasClass(element, SLIDES_WRAPPER))){

              //scrolling horizontally through the slides?
              if(element.self != window  && hasClass(element, SLIDES_WRAPPER)){
                  element.scrollLeft = val;
              }
              //vertical scroll
              else{
                  element.scrollTo(0, val);
              }
          }else{
               element.style.top = val + 'px';
          }
      }

      /**
      * Gets the active slide.
      */
      function getActiveSlide(){
          var activeSlide = $(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0];
          return nullOrSlide(activeSlide);
      }

      /**
      * Gets the active section.
      */
      function getActiveSection(){
          return new Section($(SECTION_ACTIVE_SEL)[0]);
      }

      /**
      * Item. Slide or Section objects share the same properties.
      */
      function Item(el, selector){
          this.anchor = el.getAttribute('data-anchor');
          this.item = el;
          this.index = index(el, selector);
          this.isLast = this.index === el.parentElement.querySelectorAll(selector).length -1;
          this.isFirst = !this.index;
      }

      /**
      * Section object
      */
      function Section(el){
          Item.call(this, el, SECTION_SEL);
      }

      /**
      * Slide object
      */
      function Slide(el){
          Item.call(this, el, SLIDE_SEL);
      }

      return FP;
  } //end of $.fn.fullpage

  //utils
  /**
  * Shows a message in the console of the given type.
  */
  function showError(type, text){
      window.console && window.console[type] && window.console[type]('fullPage: ' + text);
  }

  /**
  * Equivalent or jQuery function $().
  */
  function $(selector, context){
      context = arguments.length > 1 ? context : document;
      return context ? context.querySelectorAll(selector) : null;
  }

  /**
  * Extends a given Object properties and its childs.
  */
  function deepExtend(out) {
      out = out || {};
      for (var i = 1, len = arguments.length; i < len; ++i){
          var obj = arguments[i];

          if(!obj){
            continue;
          }

          for(var key in obj){
            if (!obj.hasOwnProperty(key)){
              continue;
            }

            // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
            if (Object.prototype.toString.call(obj[key]) === '[object Object]'){
              out[key] = deepExtend(out[key], obj[key]);
              continue;
            }

            out[key] = obj[key];
          }
      }
      return out;
  }

  /**
  * Checks if the passed element contains the passed class.
  */
  function hasClass(el, className){
      if(el == null){
          return false;
      }
      if (el.classList){
          return el.classList.contains(className);
      }
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }

  /**
  * Gets the window height. Crossbrowser.
  */
  function getWindowHeight(){
      return 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
  }

  /**
  * Gets the window width.
  */
  function getWindowWidth(){
      return window.innerWidth;
  }

  /**
  * Set's the CSS properties for the passed item/s.
  * @param {NodeList|HTMLElement} items
  * @param {Object} props css properties and values.
  */
  function css(items, props) {
      items = getList(items);

      var key;
      for (key in props) {
          if (props.hasOwnProperty(key)) {
              if (key !== null) {
                  for (var i = 0; i < items.length; i++) {
                      var item = items[i];
                      item.style[key] = props[key];
                  }
              }
          }
      }

      return items;
  }

  /**
  * Generic function to get the previous or next element.
  */
  function until(item, selector, fn){
      var sibling = item[fn];
      while(sibling && !matches(sibling, selector)){
          sibling = sibling[fn];
      }

      return sibling;
  }

  /**
  * Gets the previous element to the passed element that matches the passed selector.
  */
  function prevUntil(item, selector){
      return until(item, selector, 'previousElementSibling');
  }

  /**
  * Gets the next element to the passed element that matches the passed selector.
  */
  function nextUntil(item, selector){
      return until(item, selector, 'nextElementSibling');
  }

  /**
  * Gets the previous element to the passed element.
  */
  function prev(item){
      return item.previousElementSibling;
  }

  /**
  * Gets the next element to the passed element.
  */
  function next(item){
      return item.nextElementSibling;
  }

  /**
  * Gets the last element from the passed list of elements.
  */
  function last(item){
      return item[item.length-1];
  }

  /**
  * Gets index from the passed element.
  * @param {String} selector is optional.
  */
  function index(item, selector) {
      item = isArrayOrList(item) ? item[0] : item;
      var children = selector != null? $(selector, item.parentNode) : item.parentNode.childNodes;
      var num = 0;
      for (var i=0; i<children.length; i++) {
           if (children[i] == item) return num;
           if (children[i].nodeType==1) num++;
      }
      return -1;
  }

  /**
  * Gets an iterable element for the passed element/s
  */
  function getList(item){
      return !isArrayOrList(item) ? [item] : item;
  }

  /**
  * Adds the display=none property for the passed element/s
  */
  function hide(el){
      el = getList(el);

      for(var i = 0; i<el.length; i++){
          el[i].style.display = 'none';
      }
      return el;
  }

  /**
  * Adds the display=block property for the passed element/s
  */
  function show(el){
      el = getList(el);

      for(var i = 0; i<el.length; i++){
          el[i].style.display = 'block';
      }
      return el;
  }

  /**
  * Checks if the passed element is an iterable element or not
  */
  function isArrayOrList(el){
      return Object.prototype.toString.call( el ) === '[object Array]' ||
          Object.prototype.toString.call( el ) === '[object NodeList]';
  }

  /**
  * Adds the passed class to the passed element/s
  */
  function addClass(el, className) {
      el = getList(el);

      for(var i = 0; i<el.length; i++){
          var item = el[i];
          if (item.classList){
              item.classList.add(className);
          }
          else{
            item.className += ' ' + className;
          }
      }
      return el;
  }

  /**
  * Removes the passed class to the passed element/s
  * @param {String} `className` can be multiple classnames separated by whitespace
  */
  function removeClass(el, className){
      el = getList(el);

      var classNames = className.split(' ');

      for(var a = 0; a<classNames.length; a++){
          className = classNames[a];
          for(var i = 0; i<el.length; i++){
              var item = el[i];
              if (item.classList){
                  item.classList.remove(className);
              }
              else{
                  item.className = item.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
              }
          }
      }
      return el;
  }

  /**
  * Appends the given element ot the given parent.
  */
  function appendTo(el, parent){
      parent.appendChild(el);
  }

  /**
  Usage:

  var wrapper = document.createElement('div');
  wrapper.className = 'fp-slides';
  wrap($('.slide'), wrapper);

  https://jsfiddle.net/qwzc7oy3/15/ (vanilla)
  https://jsfiddle.net/oya6ndka/1/ (jquery equivalent)
  */
  function wrap(toWrap, wrapper, isWrapAll) {
      var newParent;
      wrapper = wrapper || document.createElement('div');
      for(var i = 0; i < toWrap.length; i++){
          var item = toWrap[i];
          if(isWrapAll && !i || !isWrapAll){
              newParent = wrapper.cloneNode(true);
              item.parentNode.insertBefore(newParent, item);
          }
          newParent.appendChild(item);
      }
      return toWrap;
  }

  /**
  Usage:
  var wrapper = document.createElement('div');
  wrapper.className = 'fp-slides';
  wrap($('.slide'), wrapper);

  https://jsfiddle.net/qwzc7oy3/27/ (vanilla)
  https://jsfiddle.net/oya6ndka/4/ (jquery equivalent)
  */
  function wrapAll(toWrap, wrapper) {
      wrap(toWrap, wrapper, true);
  }

  /**
  * Usage:
  * wrapInner(document.querySelector('#pepe'), '<div class="test">afdas</div>');
  * wrapInner(document.querySelector('#pepe'), element);
  *
  * https://jsfiddle.net/zexxz0tw/6/
  *
  * https://stackoverflow.com/a/21817590/1081396
  */
  function wrapInner(parent, wrapper) {
      if (typeof wrapper === "string"){
          wrapper = createElementFromHTML(wrapper);
      }

      parent.appendChild(wrapper);

      while(parent.firstChild !== wrapper){
          wrapper.appendChild(parent.firstChild);
     }
  }

  /**
  * Usage:
  * unwrap(document.querySelector('#pepe'));
  * unwrap(element);
  *
  * https://jsfiddle.net/szjt0hxq/1/
  *
  */
  function unwrap(wrapper) {
      var wrapperContent = document.createDocumentFragment();
      while (wrapper.firstChild) {
          wrapperContent.appendChild(wrapper.firstChild);
      }

      wrapper.parentNode.replaceChild(wrapperContent, wrapper);
  }

  /**
  * http://stackoverflow.com/questions/22100853/dom-pure-javascript-solution-to-jquery-closest-implementation
  * Returns the element or `false` if there's none
  */
  function closest(el, selector) {
      if(el && el.nodeType === 1){
          if(matches(el, selector)){
              return el;
          }
          return closest(el.parentNode, selector);
      }
      return null;
  }

  /**
  * Places one element (rel) after another one or group of them (reference).
  * @param {HTMLElement} reference
  * @param {HTMLElement|NodeList|String} el
  * https://jsfiddle.net/9s97hhzv/1/
  */
  function after(reference, el) {
      insertBefore(reference, reference.nextSibling, el);
  }

  /**
  * Places one element (rel) before another one or group of them (reference).
  * @param {HTMLElement} reference
  * @param {HTMLElement|NodeList|String} el
  * https://jsfiddle.net/9s97hhzv/1/
  */
  function before(reference, el) {
      insertBefore(reference, reference, el);
  }

  /**
  * Based in https://stackoverflow.com/a/19316024/1081396
  * and https://stackoverflow.com/a/4793630/1081396
  */
  function insertBefore(reference, beforeElement, el){
      if(!isArrayOrList(el)){
          if(typeof el == 'string'){
              el = createElementFromHTML(el);
          }
          el = [el];
      }

      for(var i = 0; i<el.length; i++){
          reference.parentNode.insertBefore(el[i], beforeElement);
      }
  }

  //http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
  function getScrollTop(){
      var doc = document.documentElement;
      return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  }

  /**
  * Gets the siblings of the passed element
  */
  function siblings(el){
      return Array.prototype.filter.call(el.parentNode.children, function(child){
        return child !== el;
      });
  }

  //for IE 9 ?
  function preventDefault(event){
      if(event.preventDefault){
          event.preventDefault();
      }
      else{
          event.returnValue = false;
      }
  }

  /**
  * Determines whether the passed item is of function type.
  */
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }

  /**
  * Trigger custom events
  */
  function trigger(el, eventName, data){
      var event;
      data = typeof data === 'undefined' ? {} : data;

      // Native
      if(typeof window.CustomEvent === "function" ){
          event = new CustomEvent(eventName, {detail: data});
      }
      else{
          event = document.createEvent('CustomEvent');
          event.initCustomEvent(eventName, true, true, data);
      }

      el.dispatchEvent(event);
  }

  /**
  * Polyfill of .matches()
  */
  function matches(el, selector) {
      return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  /**
  * Toggles the visibility of the passed element el.
  */
  function toggle(el, value){
      if(typeof value === "boolean"){
          for(var i = 0; i<el.length; i++){
              el[i].style.display = value ? 'block' : 'none';
          }
      }
      //we don't use it in other way, so no else :)

      return el;
  }

  /**
  * Creates a HTMLElement from the passed HTML string.
  * https://stackoverflow.com/a/494348/1081396
  */
  function createElementFromHTML(htmlString) {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes
      return div.firstChild;
  }

  /**
  * Removes the passed item/s from the DOM.
  */
  function remove(items){
      items = getList(items);
      for(var i = 0; i<items.length; i++){
          var item = items[i];
          if(item && item.parentElement) {
              item.parentNode.removeChild(item);
          }
      }
  }

  /**
  * Filters an array by the passed filter funtion.
  */
  function filter(el, filterFn){
      Array.prototype.filter.call(el, filterFn);
  }

  //https://jsfiddle.net/w1rktecz/
  function untilAll(item, selector, fn){
      var sibling = item[fn];
      var siblings = [];
      while(sibling){
          if(matches(sibling, selector) || selector == null) {
              siblings.push(sibling);
          }
          sibling = sibling[fn];
      }

      return siblings;
  }

  /**
  * Gets all next elements matching the passed selector.
  */
  function nextAll(item, selector){
      return untilAll(item, selector, 'nextElementSibling');
  }

  /**
  * Gets all previous elements matching the passed selector.
  */
  function prevAll(item, selector){
      return untilAll(item, selector, 'previousElementSibling');
  }

  /**
  * Converts an object to an array.
  */
  function toArray(objectData){
      return Object.keys(objectData).map(function(key) {
         return objectData[key];
      });
  }

  /**
  * forEach polyfill for IE
  * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
  */
  if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
          thisArg = thisArg || window;
          for (var i = 0; i < this.length; i++) {
              callback.call(thisArg, this[i], i, this);
          }
      };
  }

  //utils are public, so we can use it wherever we want
  window.fp_utils = {
      $: $,
      deepExtend: deepExtend,
      hasClass: hasClass,
      getWindowHeight: getWindowHeight,
      css: css,
      until: until,
      prevUntil: prevUntil,
      nextUntil: nextUntil,
      prev: prev,
      next: next,
      last: last,
      index: index,
      getList: getList,
      hide: hide,
      show: show,
      isArrayOrList: isArrayOrList,
      addClass: addClass,
      removeClass: removeClass,
      appendTo: appendTo,
      wrap: wrap,
      wrapAll: wrapAll,
      wrapInner: wrapInner,
      unwrap: unwrap,
      closest: closest,
      after: after,
      before: before,
      insertBefore: insertBefore,
      getScrollTop: getScrollTop,
      siblings: siblings,
      preventDefault: preventDefault,
      isFunction: isFunction,
      trigger: trigger,
      matches: matches,
      toggle: toggle,
      createElementFromHTML: createElementFromHTML,
      remove: remove,
      filter: filter,
      untilAll: untilAll,
      nextAll: nextAll,
      prevAll: prevAll,
      showError: showError
  };

  return initialise;
}));

/**
* jQuery adapter for fullPage.js 3.0.0
*/
if(window.jQuery && window.fullpage){
  (function ($, fullpage) {
      'use strict';

      // No jQuery No Go
      if (!$ || !fullpage) {
          window.fp_utils.showError('error', 'jQuery is required to use the jQuery fullpage adapter!');
          return;
      }

      $.fn.fullpage = function(options) {
          options = $.extend({}, options, {'$': $});
          var instance = new fullpage(this[0], options);
      };
  })(window.jQuery, window.fullpage);
}

/**
* Customized version of iScroll.js 0.1.3
* It fixes bugs affecting its integration with fullpage.js
* @license
*/
!function(r,n,p){var f=r.requestAnimationFrame||r.webkitRequestAnimationFrame||r.mozRequestAnimationFrame||r.oRequestAnimationFrame||r.msRequestAnimationFrame||function(t){r.setTimeout(t,1e3/60)},m=function(){var e={},o=n.createElement("div").style,i=function(){for(var t=["t","webkitT","MozT","msT","OT"],i=0,s=t.length;i<s;i++)if(t[i]+"ransform"in o)return t[i].substr(0,t[i].length-1);return!1}();function t(t){return!1!==i&&(""===i?t:i+t.charAt(0).toUpperCase()+t.substr(1))}e.getTime=Date.now||function(){return(new Date).getTime()},e.extend=function(t,i){for(var s in i)t[s]=i[s]},e.addEvent=function(t,i,s,e){t.addEventListener(i,s,!!e)},e.removeEvent=function(t,i,s,e){t.removeEventListener(i,s,!!e)},e.prefixPointerEvent=function(t){return r.MSPointerEvent?"MSPointer"+t.charAt(7).toUpperCase()+t.substr(8):t},e.momentum=function(t,i,s,e,o,n){var r,h,a=t-i,l=p.abs(a)/s;return h=l/(n=void 0===n?6e-4:n),(r=t+l*l/(2*n)*(a<0?-1:1))<e?(r=o?e-o/2.5*(l/8):e,h=(a=p.abs(r-t))/l):0<r&&(r=o?o/2.5*(l/8):0,h=(a=p.abs(t)+r)/l),{destination:p.round(r),duration:h}};var s=t("transform");return e.extend(e,{hasTransform:!1!==s,hasPerspective:t("perspective")in o,hasTouch:"ontouchstart"in r,hasPointer:!(!r.PointerEvent&&!r.MSPointerEvent),hasTransition:t("transition")in o}),e.isBadAndroid=function(){var t=r.navigator.appVersion;if(!/Android/.test(t)||/Chrome\/\d/.test(t))return!1;var i=t.match(/Safari\/(\d+.\d)/);return!(i&&"object"==typeof i&&2<=i.length)||parseFloat(i[1])<535.19}(),e.extend(e.style={},{transform:s,transitionTimingFunction:t("transitionTimingFunction"),transitionDuration:t("transitionDuration"),transitionDelay:t("transitionDelay"),transformOrigin:t("transformOrigin")}),e.hasClass=function(t,i){return new RegExp("(^|\\s)"+i+"(\\s|$)").test(t.className)},e.addClass=function(t,i){if(!e.hasClass(t,i)){var s=t.className.split(" ");s.push(i),t.className=s.join(" ")}},e.removeClass=function(t,i){if(e.hasClass(t,i)){var s=new RegExp("(^|\\s)"+i+"(\\s|$)","g");t.className=t.className.replace(s," ")}},e.offset=function(t){for(var i=-t.offsetLeft,s=-t.offsetTop;t=t.offsetParent;)i-=t.offsetLeft,s-=t.offsetTop;return{left:i,top:s}},e.preventDefaultException=function(t,i){for(var s in i)if(i[s].test(t[s]))return!0;return!1},e.extend(e.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),e.extend(e.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(t){return t*(2-t)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(t){return p.sqrt(1- --t*t)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(t){return(t-=1)*t*(5*t+4)+1}},bounce:{style:"",fn:function(t){return(t/=1)<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},elastic:{style:"",fn:function(t){return 0===t?0:1==t?1:.4*p.pow(2,-10*t)*p.sin((t-.055)*(2*p.PI)/.22)+1}}}),e.tap=function(t,i){var s=n.createEvent("Event");s.initEvent(i,!0,!0),s.pageX=t.pageX,s.pageY=t.pageY,t.target.dispatchEvent(s)},e.click=function(t){var i,s=t.target;/(SELECT|INPUT|TEXTAREA)/i.test(s.tagName)||((i=n.createEvent(r.MouseEvent?"MouseEvents":"Event")).initEvent("click",!0,!0),i.view=t.view||r,i.detail=1,i.screenX=s.screenX||0,i.screenY=s.screenY||0,i.clientX=s.clientX||0,i.clientY=s.clientY||0,i.ctrlKey=!!t.ctrlKey,i.altKey=!!t.altKey,i.shiftKey=!!t.shiftKey,i.metaKey=!!t.metaKey,i.button=0,i.relatedTarget=null,i._constructed=!0,s.dispatchEvent(i))},e}();function t(t,i){for(var s in this.wrapper="string"==typeof t?n.querySelector(t):t,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,disablePointer:!m.hasPointer,disableTouch:m.hasPointer||!m.hasTouch,disableMouse:m.hasPointer||m.hasTouch,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL)$/},HWCompositing:!0,useTransition:!0,useTransform:!0,bindToWrapper:void 0===r.onmousedown},i)this.options[s]=i[s];this.translateZ=this.options.HWCompositing&&m.hasPerspective?" translateZ(0)":"",this.options.useTransition=m.hasTransition&&this.options.useTransition,this.options.useTransform=m.hasTransform&&this.options.useTransform,this.options.eventPassthrough=!0===this.options.eventPassthrough?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"!=this.options.eventPassthrough&&this.options.scrollY,this.options.scrollX="horizontal"!=this.options.eventPassthrough&&this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?m.ease[this.options.bounceEasing]||m.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,!0===this.options.tap&&(this.options.tap="tap"),this.options.useTransition||this.options.useTransform||/relative|absolute/i.test(this.scrollerStyle.position)||(this.scrollerStyle.position="relative"),"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,this.x=0,this.y=0,this.directionX=0,this.directionY=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function h(t,i,s){var e=n.createElement("div"),o=n.createElement("div");return!0===s&&(e.style.cssText="position:absolute;z-index:9999",o.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),o.className="iScrollIndicator",e.className="h"==t?(!0===s&&(e.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",o.style.height="100%"),"iScrollHorizontalScrollbar"):(!0===s&&(e.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",o.style.width="100%"),"iScrollVerticalScrollbar"),e.style.cssText+=";overflow:hidden",i||(e.style.pointerEvents="none"),e.appendChild(o),e}function a(t,i){for(var s in this.wrapper="string"==typeof i.el?n.querySelector(i.el):i.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=t,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0},i)this.options[s]=i[s];if(this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(this.options.disableTouch||(m.addEvent(this.indicator,"touchstart",this),m.addEvent(r,"touchend",this)),this.options.disablePointer||(m.addEvent(this.indicator,m.prefixPointerEvent("pointerdown"),this),m.addEvent(r,m.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(m.addEvent(this.indicator,"mousedown",this),m.addEvent(r,"mouseup",this))),this.options.fade){this.wrapperStyle[m.style.transform]=this.scroller.translateZ;var e=m.style.transitionDuration;if(!e)return;this.wrapperStyle[e]=m.isBadAndroid?"0.0001ms":"0ms";var o=this;m.isBadAndroid&&f(function(){"0.0001ms"===o.wrapperStyle[e]&&(o.wrapperStyle[e]="0s")}),this.wrapperStyle.opacity="0"}}t.prototype={version:"5.2.0",_init:function(){this._initEvents(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),clearTimeout(this.resizeTimeout),this.resizeTimeout=null,this._execEvent("destroy")},_transitionEnd:function(t){t.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(t){if(1!=m.eventType[t.type]&&0!==(t.which?t.button:t.button<2?0:4==t.button?1:2))return;if(this.enabled&&(!this.initiated||m.eventType[t.type]===this.initiated)){!this.options.preventDefault||m.isBadAndroid||m.preventDefaultException(t.target,this.options.preventDefaultException)||t.preventDefault();var i,s=t.touches?t.touches[0]:t;this.initiated=m.eventType[t.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this.startTime=m.getTime(),this.options.useTransition&&this.isInTransition?(this._transitionTime(),this.isInTransition=!1,i=this.getComputedPosition(),this._translate(p.round(i.x),p.round(i.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=s.pageX,this.pointY=s.pageY,this._execEvent("beforeScrollStart")}},_move:function(t){if(this.enabled&&m.eventType[t.type]===this.initiated){this.options.preventDefault&&t.preventDefault();var i,s,e,o,n=t.touches?t.touches[0]:t,r=n.pageX-this.pointX,h=n.pageY-this.pointY,a=m.getTime();if(this.pointX=n.pageX,this.pointY=n.pageY,this.distX+=r,this.distY+=h,e=p.abs(this.distX),o=p.abs(this.distY),!(300<a-this.endTime&&e<10&&o<10)){if(this.directionLocked||this.options.freeScroll||(e>o+this.options.directionLockThreshold?this.directionLocked="h":o>=e+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)t.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);h=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)t.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);r=0}r=this.hasHorizontalScroll?r:0,h=this.hasVerticalScroll?h:0,i=this.x+r,s=this.y+h,(0<i||i<this.maxScrollX)&&(i=this.options.bounce?this.x+r/3:0<i?0:this.maxScrollX),(0<s||s<this.maxScrollY)&&(s=this.options.bounce?this.y+h/3:0<s?0:this.maxScrollY),this.directionX=0<r?-1:r<0?1:0,this.directionY=0<h?-1:h<0?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(i,s),300<a-this.startTime&&(this.startTime=a,this.startX=this.x,this.startY=this.y)}}},_end:function(t){if(this.enabled&&m.eventType[t.type]===this.initiated){this.options.preventDefault&&!m.preventDefaultException(t.target,this.options.preventDefaultException)&&t.preventDefault();t.changedTouches&&t.changedTouches[0];var i,s,e=m.getTime()-this.startTime,o=p.round(this.x),n=p.round(this.y),r=p.abs(o-this.startX),h=p.abs(n-this.startY),a=0,l="";if(this.isInTransition=0,this.initiated=0,this.endTime=m.getTime(),!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(o,n),!this.moved)return this.options.tap&&m.tap(t,this.options.tap),this.options.click&&m.click(t),void this._execEvent("scrollCancel");if(this._events.flick&&e<200&&r<100&&h<100)this._execEvent("flick");else{if(this.options.momentum&&e<300&&(i=this.hasHorizontalScroll?m.momentum(this.x,this.startX,e,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:o,duration:0},s=this.hasVerticalScroll?m.momentum(this.y,this.startY,e,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:n,duration:0},o=i.destination,n=s.destination,a=p.max(i.duration,s.duration),this.isInTransition=1),this.options.snap){var c=this._nearestSnap(o,n);this.currentPage=c,a=this.options.snapSpeed||p.max(p.max(p.min(p.abs(o-c.x),1e3),p.min(p.abs(n-c.y),1e3)),300),o=c.x,n=c.y,this.directionX=0,this.directionY=0,l=this.options.bounceEasing}if(o!=this.x||n!=this.y)return(0<o||o<this.maxScrollX||0<n||n<this.maxScrollY)&&(l=m.ease.quadratic),void this.scrollTo(o,n,a,l);this._execEvent("scrollEnd")}}}},_resize:function(){var t=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){t.refresh()},this.options.resizePolling)},resetPosition:function(t){var i=this.x,s=this.y;return t=t||0,!this.hasHorizontalScroll||0<this.x?i=0:this.x<this.maxScrollX&&(i=this.maxScrollX),!this.hasVerticalScroll||0<this.y?s=0:this.y<this.maxScrollY&&(s=this.maxScrollY),(i!=this.x||s!=this.y)&&(this.scrollTo(i,s,t,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,this.wrapperOffset=m.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(t,i){this._events[t]||(this._events[t]=[]),this._events[t].push(i)},off:function(t,i){if(this._events[t]){var s=this._events[t].indexOf(i);-1<s&&this._events[t].splice(s,1)}},_execEvent:function(t){if(this._events[t]){var i=0,s=this._events[t].length;if(s)for(;i<s;i++)this._events[t][i].apply(this,[].slice.call(arguments,1))}},scrollBy:function(t,i,s,e){t=this.x+t,i=this.y+i,s=s||0,this.scrollTo(t,i,s,e)},scrollTo:function(t,i,s,e){e=e||m.ease.circular,this.isInTransition=this.options.useTransition&&0<s;var o=this.options.useTransition&&e.style;!s||o?(o&&(this._transitionTimingFunction(e.style),this._transitionTime(s)),this._translate(t,i)):this._animate(t,i,s,e.fn)},scrollToElement:function(t,i,s,e,o){if(t=t.nodeType?t:this.scroller.querySelector(t)){var n=m.offset(t);n.left-=this.wrapperOffset.left,n.top-=this.wrapperOffset.top,!0===s&&(s=p.round(t.offsetWidth/2-this.wrapper.offsetWidth/2)),!0===e&&(e=p.round(t.offsetHeight/2-this.wrapper.offsetHeight/2)),n.left-=s||0,n.top-=e||0,n.left=0<n.left?0:n.left<this.maxScrollX?this.maxScrollX:n.left,n.top=0<n.top?0:n.top<this.maxScrollY?this.maxScrollY:n.top,i=null==i||"auto"===i?p.max(p.abs(this.x-n.left),p.abs(this.y-n.top)):i,this.scrollTo(n.left,n.top,i,o)}},_transitionTime:function(t){if(this.options.useTransition){t=t||0;var i=m.style.transitionDuration;if(i){if(this.scrollerStyle[i]=t+"ms",!t&&m.isBadAndroid){this.scrollerStyle[i]="0.0001ms";var s=this;f(function(){"0.0001ms"===s.scrollerStyle[i]&&(s.scrollerStyle[i]="0s")})}if(this.indicators)for(var e=this.indicators.length;e--;)this.indicators[e].transitionTime(t)}}},_transitionTimingFunction:function(t){if(this.scrollerStyle[m.style.transitionTimingFunction]=t,this.indicators)for(var i=this.indicators.length;i--;)this.indicators[i].transitionTimingFunction(t)},_translate:function(t,i){if(this.options.useTransform?this.scrollerStyle[m.style.transform]="translate("+t+"px,"+i+"px)"+this.translateZ:(t=p.round(t),i=p.round(i),this.scrollerStyle.left=t+"px",this.scrollerStyle.top=i+"px"),this.x=t,this.y=i,this.indicators)for(var s=this.indicators.length;s--;)this.indicators[s].updatePosition()},_initEvents:function(t){var i=t?m.removeEvent:m.addEvent,s=this.options.bindToWrapper?this.wrapper:r;i(r,"orientationchange",this),i(r,"resize",this),this.options.click&&i(this.wrapper,"click",this,!0),this.options.disableMouse||(i(this.wrapper,"mousedown",this),i(s,"mousemove",this),i(s,"mousecancel",this),i(s,"mouseup",this)),m.hasPointer&&!this.options.disablePointer&&(i(this.wrapper,m.prefixPointerEvent("pointerdown"),this),i(s,m.prefixPointerEvent("pointermove"),this),i(s,m.prefixPointerEvent("pointercancel"),this),i(s,m.prefixPointerEvent("pointerup"),this)),m.hasTouch&&!this.options.disableTouch&&(i(this.wrapper,"touchstart",this),i(s,"touchmove",this),i(s,"touchcancel",this),i(s,"touchend",this)),i(this.scroller,"transitionend",this),i(this.scroller,"webkitTransitionEnd",this),i(this.scroller,"oTransitionEnd",this),i(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var t,i,s=r.getComputedStyle(this.scroller,null);return i=this.options.useTransform?(t=+((s=s[m.style.transform].split(")")[0].split(", "))[12]||s[4]),+(s[13]||s[5])):(t=+s.left.replace(/[^-\d.]/g,""),+s.top.replace(/[^-\d.]/g,"")),{x:t,y:i}},_initIndicators:function(){var t,i=this.options.interactiveScrollbars,s="string"!=typeof this.options.scrollbars,e=[],o=this;this.indicators=[],this.options.scrollbars&&(this.options.scrollY&&(t={el:h("v",i,this.options.scrollbars),interactive:i,defaultScrollbars:!0,customStyle:s,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(t.el),e.push(t)),this.options.scrollX&&(t={el:h("h",i,this.options.scrollbars),interactive:i,defaultScrollbars:!0,customStyle:s,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(t.el),e.push(t))),this.options.indicators&&(e=e.concat(this.options.indicators));for(var n=e.length;n--;)this.indicators.push(new a(this,e[n]));function r(t){if(o.indicators)for(var i=o.indicators.length;i--;)t.call(o.indicators[i])}this.options.fadeScrollbars&&(this.on("scrollEnd",function(){r(function(){this.fade()})}),this.on("scrollCancel",function(){r(function(){this.fade()})}),this.on("scrollStart",function(){r(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){r(function(){this.fade(1,!0)})})),this.on("refresh",function(){r(function(){this.refresh()})}),this.on("destroy",function(){r(function(){this.destroy()}),delete this.indicators})},_initWheel:function(){m.addEvent(this.wrapper,"wheel",this),m.addEvent(this.wrapper,"mousewheel",this),m.addEvent(this.wrapper,"DOMMouseScroll",this),this.on("destroy",function(){clearTimeout(this.wheelTimeout),this.wheelTimeout=null,m.removeEvent(this.wrapper,"wheel",this),m.removeEvent(this.wrapper,"mousewheel",this),m.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(t){if(this.enabled){r.navigator.userAgent.match(/(MSIE|Trident)/)||t.preventDefault();var i,s,e,o,n=this;if(void 0===this.wheelTimeout&&n._execEvent("scrollStart"),clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){n.options.snap||n._execEvent("scrollEnd"),n.wheelTimeout=void 0},400),"deltaX"in t)s=1===t.deltaMode?(i=-t.deltaX*this.options.mouseWheelSpeed,-t.deltaY*this.options.mouseWheelSpeed):(i=-t.deltaX,-t.deltaY);else if("wheelDeltaX"in t)i=t.wheelDeltaX/120*this.options.mouseWheelSpeed,s=t.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in t)i=s=t.wheelDelta/120*this.options.mouseWheelSpeed;else{if(!("detail"in t))return;i=s=-t.detail/3*this.options.mouseWheelSpeed}if(i*=this.options.invertWheelDirection,s*=this.options.invertWheelDirection,this.hasVerticalScroll||(i=s,s=0),this.options.snap)return e=this.currentPage.pageX,o=this.currentPage.pageY,0<i?e--:i<0&&e++,0<s?o--:s<0&&o++,void this.goToPage(e,o);e=this.x+p.round(this.hasHorizontalScroll?i:0),o=this.y+p.round(this.hasVerticalScroll?s:0),this.directionX=0<i?-1:i<0?1:0,this.directionY=0<s?-1:s<0?1:0,0<e?e=0:e<this.maxScrollX&&(e=this.maxScrollX),0<o?o=0:o<this.maxScrollY&&(o=this.maxScrollY),this.scrollTo(e,o,0)}},_initSnap:function(){this.currentPage={},"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap)),this.on("refresh",function(){var t,i,s,e,o,n,r=0,h=0,a=0,l=this.options.snapStepX||this.wrapperWidth,c=this.options.snapStepY||this.wrapperHeight;if(this.pages=[],this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(!0===this.options.snap)for(s=p.round(l/2),e=p.round(c/2);a>-this.scrollerWidth;){for(this.pages[r]=[],o=t=0;o>-this.scrollerHeight;)this.pages[r][t]={x:p.max(a,this.maxScrollX),y:p.max(o,this.maxScrollY),width:l,height:c,cx:a-s,cy:o-e},o-=c,t++;a-=l,r++}else for(t=(n=this.options.snap).length,i=-1;r<t;r++)(0===r||n[r].offsetLeft<=n[r-1].offsetLeft)&&(h=0,i++),this.pages[h]||(this.pages[h]=[]),a=p.max(-n[r].offsetLeft,this.maxScrollX),o=p.max(-n[r].offsetTop,this.maxScrollY),s=a-p.round(n[r].offsetWidth/2),e=o-p.round(n[r].offsetHeight/2),this.pages[h][i]={x:a,y:o,width:n[r].offsetWidth,height:n[r].offsetHeight,cx:s,cy:e},a>this.maxScrollX&&h++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1==0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=p.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=p.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}}),this.on("flick",function(){var t=this.options.snapSpeed||p.max(p.max(p.min(p.abs(this.x-this.startX),1e3),p.min(p.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,t)})},_nearestSnap:function(t,i){if(!this.pages.length)return{x:0,y:0,pageX:0,pageY:0};var s=0,e=this.pages.length,o=0;if(p.abs(t-this.absStartX)<this.snapThresholdX&&p.abs(i-this.absStartY)<this.snapThresholdY)return this.currentPage;for(0<t?t=0:t<this.maxScrollX&&(t=this.maxScrollX),0<i?i=0:i<this.maxScrollY&&(i=this.maxScrollY);s<e;s++)if(t>=this.pages[s][0].cx){t=this.pages[s][0].x;break}for(e=this.pages[s].length;o<e;o++)if(i>=this.pages[0][o].cy){i=this.pages[0][o].y;break}return s==this.currentPage.pageX&&((s+=this.directionX)<0?s=0:s>=this.pages.length&&(s=this.pages.length-1),t=this.pages[s][0].x),o==this.currentPage.pageY&&((o+=this.directionY)<0?o=0:o>=this.pages[0].length&&(o=this.pages[0].length-1),i=this.pages[0][o].y),{x:t,y:i,pageX:s,pageY:o}},goToPage:function(t,i,s,e){e=e||this.options.bounceEasing,t>=this.pages.length?t=this.pages.length-1:t<0&&(t=0),i>=this.pages[t].length?i=this.pages[t].length-1:i<0&&(i=0);var o=this.pages[t][i].x,n=this.pages[t][i].y;s=void 0===s?this.options.snapSpeed||p.max(p.max(p.min(p.abs(o-this.x),1e3),p.min(p.abs(n-this.y),1e3)),300):s,this.currentPage={x:o,y:n,pageX:t,pageY:i},this.scrollTo(o,n,s,e)},next:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;++s>=this.pages.length&&this.hasVerticalScroll&&(s=0,e++),this.goToPage(s,e,t,i)},prev:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;--s<0&&this.hasVerticalScroll&&(s=0,e--),this.goToPage(s,e,t,i)},_initKeys:function(t){var i,s={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};if("object"==typeof this.options.keyBindings)for(i in this.options.keyBindings)"string"==typeof this.options.keyBindings[i]&&(this.options.keyBindings[i]=this.options.keyBindings[i].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(i in s)this.options.keyBindings[i]=this.options.keyBindings[i]||s[i];m.addEvent(r,"keydown",this),this.on("destroy",function(){m.removeEvent(r,"keydown",this)})},_key:function(t){if(this.enabled){var i,s=this.options.snap,e=s?this.currentPage.pageX:this.x,o=s?this.currentPage.pageY:this.y,n=m.getTime(),r=this.keyTime||0;switch(this.options.useTransition&&this.isInTransition&&(i=this.getComputedPosition(),this._translate(p.round(i.x),p.round(i.y)),this.isInTransition=!1),this.keyAcceleration=n-r<200?p.min(this.keyAcceleration+.25,50):0,t.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?e+=s?1:this.wrapperWidth:o+=s?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?e-=s?1:this.wrapperWidth:o-=s?1:this.wrapperHeight;break;case this.options.keyBindings.end:e=s?this.pages.length-1:this.maxScrollX,o=s?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:o=e=0;break;case this.options.keyBindings.left:e+=s?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:o+=s?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:e-=s?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:o-=s?1:5+this.keyAcceleration>>0;break;default:return}s?this.goToPage(e,o):(0<e?(e=0,this.keyAcceleration=0):e<this.maxScrollX&&(e=this.maxScrollX,this.keyAcceleration=0),0<o?(o=0,this.keyAcceleration=0):o<this.maxScrollY&&(o=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(e,o,0),this.keyTime=n)}},_animate:function(n,r,h,a){var l=this,c=this.x,p=this.y,d=m.getTime(),u=d+h;this.isAnimating=!0,function t(){var i,s,e,o=m.getTime();if(u<=o)return l.isAnimating=!1,l._translate(n,r),void(l.resetPosition(l.options.bounceTime)||l._execEvent("scrollEnd"));e=a(o=(o-d)/h),i=(n-c)*e+c,s=(r-p)*e+p,l._translate(i,s),l.isAnimating&&f(t)}()},handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(t);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(t);break;case"keydown":this._key(t);break;case"click":this.enabled&&!t._constructed&&(t.preventDefault(),t.stopPropagation())}}},a.prototype={handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t)}},destroy:function(){this.options.fadeScrollbars&&(clearTimeout(this.fadeTimeout),this.fadeTimeout=null),this.options.interactive&&(m.removeEvent(this.indicator,"touchstart",this),m.removeEvent(this.indicator,m.prefixPointerEvent("pointerdown"),this),m.removeEvent(this.indicator,"mousedown",this),m.removeEvent(r,"touchmove",this),m.removeEvent(r,m.prefixPointerEvent("pointermove"),this),m.removeEvent(r,"mousemove",this),m.removeEvent(r,"touchend",this),m.removeEvent(r,m.prefixPointerEvent("pointerup"),this),m.removeEvent(r,"mouseup",this)),this.options.defaultScrollbars&&this.wrapper.parentNode.removeChild(this.wrapper)},_start:function(t){var i=t.touches?t.touches[0]:t;t.preventDefault(),t.stopPropagation(),this.transitionTime(),this.initiated=!0,this.moved=!1,this.lastPointX=i.pageX,this.lastPointY=i.pageY,this.startTime=m.getTime(),this.options.disableTouch||m.addEvent(r,"touchmove",this),this.options.disablePointer||m.addEvent(r,m.prefixPointerEvent("pointermove"),this),this.options.disableMouse||m.addEvent(r,"mousemove",this),this.scroller._execEvent("beforeScrollStart")},_move:function(t){var i,s,e,o,n=t.touches?t.touches[0]:t;m.getTime();this.moved||this.scroller._execEvent("scrollStart"),this.moved=!0,i=n.pageX-this.lastPointX,this.lastPointX=n.pageX,s=n.pageY-this.lastPointY,this.lastPointY=n.pageY,e=this.x+i,o=this.y+s,this._pos(e,o),t.preventDefault(),t.stopPropagation()},_end:function(t){if(this.initiated){if(this.initiated=!1,t.preventDefault(),t.stopPropagation(),m.removeEvent(r,"touchmove",this),m.removeEvent(r,m.prefixPointerEvent("pointermove"),this),m.removeEvent(r,"mousemove",this),this.scroller.options.snap){var i=this.scroller._nearestSnap(this.scroller.x,this.scroller.y),s=this.options.snapSpeed||p.max(p.max(p.min(p.abs(this.scroller.x-i.x),1e3),p.min(p.abs(this.scroller.y-i.y),1e3)),300);this.scroller.x==i.x&&this.scroller.y==i.y||(this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=i,this.scroller.scrollTo(i.x,i.y,s,this.scroller.options.bounceEasing))}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(t){t=t||0;var i=m.style.transitionDuration;if(i&&(this.indicatorStyle[i]=t+"ms",!t&&m.isBadAndroid)){this.indicatorStyle[i]="0.0001ms";var s=this;f(function(){"0.0001ms"===s.indicatorStyle[i]&&(s.indicatorStyle[i]="0s")})}},transitionTimingFunction:function(t){this.indicatorStyle[m.style.transitionTimingFunction]=t},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(m.addClass(this.wrapper,"iScrollBothScrollbars"),m.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(m.removeClass(this.wrapper,"iScrollBothScrollbars"),m.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));this.wrapper.offsetHeight;this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=p.max(p.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=8-this.indicatorWidth,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=p.max(p.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=8-this.indicatorHeight,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var t=this.options.listenX&&p.round(this.sizeRatioX*this.scroller.x)||0,i=this.options.listenY&&p.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(t<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=p.max(this.indicatorWidth+t,8),this.indicatorStyle.width=this.width+"px"),t=this.minBoundaryX):t>this.maxBoundaryX?t="scale"==this.options.shrink?(this.width=p.max(this.indicatorWidth-(t-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",this.maxPosX+this.indicatorWidth-this.width):this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),i<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=p.max(this.indicatorHeight+3*i,8),this.indicatorStyle.height=this.height+"px"),i=this.minBoundaryY):i>this.maxBoundaryY?i="scale"==this.options.shrink?(this.height=p.max(this.indicatorHeight-3*(i-this.maxPosY),8),this.indicatorStyle.height=this.height+"px",this.maxPosY+this.indicatorHeight-this.height):this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px")),this.x=t,this.y=i,this.scroller.options.useTransform?this.indicatorStyle[m.style.transform]="translate("+t+"px,"+i+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=t+"px",this.indicatorStyle.top=i+"px")},_pos:function(t,i){t<0?t=0:t>this.maxPosX&&(t=this.maxPosX),i<0?i=0:i>this.maxPosY&&(i=this.maxPosY),t=this.options.listenX?p.round(t/this.sizeRatioX):this.scroller.x,i=this.options.listenY?p.round(i/this.sizeRatioY):this.scroller.y,this.scroller.scrollTo(t,i)},fade:function(t,i){if(!i||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var s=t?250:500,e=t?0:300;t=t?"1":"0",this.wrapperStyle[m.style.transitionDuration]=s+"ms",this.fadeTimeout=setTimeout(function(t){this.wrapperStyle.opacity=t,this.visible=+t}.bind(this,t),e)}}},t.utils=m,"undefined"!=typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd?(define(function(){return t}),void 0!==r&&(r.IScroll=t)):r.IScroll=t}(window,document,Math),
/*!
* Scrolloverflow 2.0.5 module for fullPage.js >= 3
* https://github.com/alvarotrigo/fullPage.js
* @license MIT licensed
*
* Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
*/
function(l,c){l.fp_scrolloverflow=function(){l.IScroll||(l.IScroll=module.exports);var s="fp-scrollable",n="."+s,t=".active",d=".fp-section",e=d+t,o=".fp-slide",u=".fp-tableCell";function r(){var p=this;function s(){var i;fp_utils.hasClass(c.body,"fp-responsive")?(i=p.options.scrollOverflowHandler,e(function(t){fp_utils.hasClass(fp_utils.closest(t,d),"fp-auto-height-responsive")&&i.remove(t)})):e(t)}function t(t){if(!fp_utils.hasClass(t,"fp-noscroll")){fp_utils.css(t,{overflow:"hidden"});var i,s,e,o=p.options.scrollOverflowHandler,n=o.wrapContent(),r=fp_utils.closest(t,d),h=o.scrollable(t),a=(s=r,null!=(e=fp_utils.closest(s,d))?parseInt(getComputedStyle(e)["padding-bottom"])+parseInt(getComputedStyle(e)["padding-top"]):0);null!=h?i=o.scrollHeight(t):(i=t.scrollHeight,p.options.verticalCentered&&(i=f(u,t)[0].scrollHeight));var l=fp_utils.getWindowHeight(),c=l-a;l<i+a?null!=h?o.update(t,c):(p.options.verticalCentered?(fp_utils.wrapInner(f(u,t)[0],n.scroller),fp_utils.wrapInner(f(u,t)[0],n.scrollable)):(fp_utils.wrapInner(t,n.scroller),fp_utils.wrapInner(t,n.scrollable)),o.create(t,c,p.iscrollOptions)):o.remove(t),fp_utils.css(t,{overflow:""})}}function e(s){f(d).forEach(function(t){var i=f(o,t);i.length?i.forEach(function(t){s(t)}):s(t)})}p.options=null,p.init=function(t,i){return p.options=t,p.iscrollOptions=i,"complete"===c.readyState&&(s(),fullpage_api.shared.afterRenderActions()),l.addEventListener("load",function(){s(),fullpage_api.shared.afterRenderActions()}),p},p.createScrollBarForAll=s,p.createScrollBar=t}IScroll.prototype.wheelOn=function(){this.wrapper.addEventListener("wheel",this),this.wrapper.addEventListener("mousewheel",this),this.wrapper.addEventListener("DOMMouseScroll",this)},IScroll.prototype.wheelOff=function(){this.wrapper.removeEventListener("wheel",this),this.wrapper.removeEventListener("mousewheel",this),this.wrapper.removeEventListener("DOMMouseScroll",this)};var f=null,h=null,a={refreshId:null,iScrollInstances:[],lastScrollY:null,hasBeenInit:!1,iscrollOptions:{scrollbars:!0,mouseWheel:!0,hideScrollbars:!1,fadeScrollbars:!1,disableMouse:!0,interactiveScrollbars:!0},init:function(t){f=fp_utils.$,h=t;var i="ontouchstart"in l||0<navigator.msMaxTouchPoints||navigator.maxTouchPoints;return a.iscrollOptions.click=i,a.hasBeenInit=!0,a.iscrollOptions=fp_utils.deepExtend(a.iscrollOptions,t.scrollOverflowOptions),(new r).init(t,a.iscrollOptions)},toggleWheel:function(s){f(n,f(e)[0]).forEach(function(t){var i=t.fp_iscrollInstance;null!=i&&(s?i.wheelOn():i.wheelOff())})},setIscroll:function(t,i){if(a.hasBeenInit){var s=fp_utils.closest(t,n)||f(n,t)[0],e=i?"enable":"disable";s&&s.fp_iscrollInstance[e]()}},onLeave:function(){a.toggleWheel(!1)},beforeLeave:function(){a.onLeave()},afterLoad:function(){a.toggleWheel(!0)},create:function(s,e,o){f(n,s).forEach(function(t){fp_utils.css(t,{height:e+"px"});var i=t.fp_iscrollInstance;null!=i&&a.iScrollInstances.forEach(function(t){t.destroy()}),i=new IScroll(t,o),a.iScrollInstances.push(i),fp_utils.hasClass(fp_utils.closest(s,d),"active")||i.wheelOff(),t.fp_iscrollInstance=i})},isScrolled:function(t,i){var s=i.fp_iscrollInstance;return!s||("top"===t?0<=s.y&&!fp_utils.getScrollTop(i):"bottom"===t?0-s.y+fp_utils.getScrollTop(i)+i.offsetHeight>=i.scrollHeight:void 0)},scrollable:function(t){return f(".fp-slides",t).length?f(n,f(".fp-slide.active",t)[0])[0]:f(n,t)[0]},scrollHeight:function(t){return f(".fp-scroller",f(n,t)[0])[0].scrollHeight},remove:function(t){if(null!=t){var i=f(n,t)[0];if(null!=i){var s=i.fp_iscrollInstance;null!=s&&s.destroy(),i.fp_iscrollInstance=null,fp_utils.unwrap(f(".fp-scroller",t)[0]),fp_utils.unwrap(f(n,t)[0])}}},update:function(t,i){clearTimeout(a.refreshId),a.refreshId=setTimeout(function(){a.iScrollInstances.forEach(function(t){t.refresh(),fullpage_api.silentMoveTo(fp_utils.index(f(e)[0])+1)})},150),fp_utils.css(f(n,t)[0],{height:i+"px"}),h.verticalCentered&&fp_utils.css(f(n,t)[0].parentNode,{height:i+"px"})},wrapContent:function(){var t=c.createElement("div");t.className=s;var i=c.createElement("div");return i.className="fp-scroller",{scrollable:t,scroller:i}}};return{iscrollHandler:a}}()}(window,document);
//# sourceMappingURL=scrolloverflow.min.js.map

var myFullpage = new fullpage('#fullpage', {
	//Navigation
	menu: '#menu',
	lockAnchors: false,
	anchors:['firstPage', 'secondPage'],
	navigation: false,
	navigationPosition: 'right',
	navigationTooltips: ['firstSlide', 'secondSlide'],
	showActiveTooltip: false,
	slidesNavigation: false,
	slidesNavPosition: 'bottom',

	//Scrolling
	css3: true,
	scrollingSpeed: 700,
	autoScrolling: true,
	fitToSection: true,
	fitToSectionDelay: 1000,
	scrollBar: false,
	easing: 'easeInOutCubic',
	easingcss3: 'ease',
	loopBottom: false,
	loopTop: false,
	loopHorizontal: true,
	continuousVertical: false,
	continuousHorizontal: false,
	scrollHorizontally: false,
	interlockedSlides: false,
	dragAndMove: false,
	offsetSections: false,
	resetSliders: false,
	fadingEffect: false,
	normalScrollElements: '#element1, .element2',
	scrollOverflow: false,
	scrollOverflowReset: false,
	scrollOverflowOptions: null,
	touchSensitivity: 15,
	bigSectionsDestination: null,

	//Accessibility
	keyboardScrolling: true,
	animateAnchor: true,
	recordHistory: true,

	//Design
	controlArrows: true,
	verticalCentered: true,
	sectionsColor : ['#ccc', '#fff'],
	paddingTop: '3em',
	paddingBottom: '10px',
	fixedElements: '#header, .footer',
	responsiveWidth: 0,
	responsiveHeight: 0,
	responsiveSlides: false,
	parallax: false,
	parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},
	cards: false,
	cardsOptions: {perspective: 100, fadeContent: true, fadeBackground: true},

	//Custom selectors
	sectionSelector: '.section',
	slideSelector: '.slide',

	lazyLoading: true,

	//events
	onLeave: function(origin, destination, direction){},
	afterLoad: function(origin, destination, direction){},
	afterRender: function(){},
	afterResize: function(width, height){},
	afterReBuild: function(){},
	afterResponsive: function(isResponsive){},
	afterSlideLoad: function(section, origin, destination, direction){},
	onSlideLeave: function(section, origin, destination, direction){}
});

document.addEventListener('DOMContentLoaded', function(){
  Typed.new('.typeWords', {
    strings: ["^600 Hanzla.", "^600 a Developer.", "^1000 a UI/UX Designer.", "^600 Wordpress Developer."],
    typeSpeed: 0,
    startDelay: 1000,
    loop: true
  });
});
var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene);

var poly = document.getElementsByClassName('polymorph');

function isElementOutViewport(el){
    var rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
}
console.log(isElementOutViewport(poly[0]))

window.onload = function()
{
   document.body.onscroll =  animePoly
}

let animeBack = new Function()
let animePoly = function () {
    var morphing = anime({
        targets: '.polymorph',
        points: [
            { value: '215, 110 0, 110 0, 0 47.7, 0 67, 76' },
            { value: '215, 110 0, 110 0, 0 0, 0 67, 76' }
        ],
        easing: 'easeOutQuad',
        duration: 1200,
        loop: false
    });

    anime({
        targets: '#blip',
        opacity: 1,
        duration: 500,
        translateY: 150
    });

    var promise = morphing.finished.then(() => {
        animeBack = function () {
            var morphing = anime({
                targets: '.polymorph',
                points: [
                    { value: '215, 110 0, 110 0, 0 47.7, 0 67, 76' },
                    { value: '215,110 0,110 0,0 49.3,0 215,0' }
                ],
                easing: 'easeOutQuad',
                duration: 1200,
                loop: false
            });
            anime({
                targets: '#blip',
                opacity: 0,
                duration: 1100,
                translateY: -800
            });
        };
    });
}
