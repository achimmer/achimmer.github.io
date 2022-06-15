// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_pie-chart
// Usage: codyhouse.co/license
(function() {
  var PieChart = function(opts) {
    this.options = Util.extend(PieChart.defaults , opts);
    this.element = this.options.element;
    this.chartArea = this.element.getElementsByClassName('js-pie-chart__area')[0];
    this.dataValues = this.element.getElementsByClassName('js-pie-chart__value');
    this.chartPaths;
    // used to convert data values to percentages
    this.percentageTot = 0; 
    this.percentageReset = getPercentageMultiplier(this);
    this.percentageStart = []; // store the start angle for each item in the chart
    this.percentageDelta = []; // store the end angle for each item in the chart
    // tooltip element
    this.tooltip = this.element.getElementsByClassName('js-pie-chart__tooltip');
    this.eventIds = [];
    this.hoverId = false;
    this.hovering = false;
    this.selectedIndex = false; // will be used for tooltip 
    this.chartLoaded = false; // used when chart is initially animated
    initPieChart(this);
    initTooltip(this);
  };

  function getPercentageMultiplier(chart) {
    var tot = 0;
    for(var i = 0; i < chart.dataValues.length; i++) {
      tot = tot + parseFloat(chart.dataValues[i].textContent);
    }
    return 100/tot;
  };

  function initPieChart(chart) {
    createChart(chart);
    animateChart(chart);
    // reset chart on resize (if required)
    resizeChart(chart);
  };

  function createChart(chart) {
    setChartSize(chart);
    // create svg element
    createChartSvg(chart);
    // visually hide svg element
    chart.chartArea.setAttribute('aria-hidden', true);
  };

  function setChartSize(chart) {
    chart.height = chart.chartArea.clientHeight;
    chart.width = chart.chartArea.clientWidth;
    // donut charts only
    if(chart.options.type == 'donut') {
      chart.donutSize = parseInt(getComputedStyle(chart.element).getPropertyValue('--pie-chart-donut-width'));
      if(chart.donutSize <= 0 || isNaN(chart.donutSize)) chart.donutSize = chart.width/4; 
    }
  };

  function createChartSvg(chart) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="'+chart.width+'" height="'+chart.height+'" class="pie-chart__svg js-pie-chart__svg"></svg>';
    chart.chartArea.innerHTML = chart.chartArea.innerHTML + svg;
    chart.svg = chart.chartArea.getElementsByClassName('js-pie-chart__svg')[0];
    // create chart content
    getPieSvgCode(chart);
  };

  function getPieSvgCode(chart) {
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gEl.setAttribute('class', 'pie-chart__dataset js-pie-chart__dataset');
    for(var i = 0; i < chart.dataValues.length; i++) {
      var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      Util.setAttributes(pathEl, {d: getPiePath(chart, i), class: 'pie-chart__data-path pie-chart__data-path--'+(i+1)+' js-pie-chart__data-path js-pie-chart__data-path--'+(i+1), 'data-index': i, 'stroke-linejoin': 'round'});
      var customStyle = chart.dataValues[i].getAttribute('data-pie-chart-style');
      if(customStyle) pathEl.setAttribute('style', customStyle);
      gEl.appendChild(pathEl);
    }

    chart.svg.appendChild(gEl);
    chart.chartPaths = chart.svg.querySelectorAll('.js-pie-chart__data-path');
  };

  function getPiePath(chart, index) {
    var startAngle = chart.percentageTot*chart.percentageReset*3.6; //convert from percentage to angles
    var dataValue = parseFloat(chart.dataValues[index].textContent);
    // update percentage start
    chart.percentageStart.push(startAngle);
    chart.percentageDelta.push(dataValue*chart.percentageReset*3.6);
    chart.percentageTot = chart.percentageTot + dataValue;
    var endAngle = chart.percentageTot*chart.percentageReset*3.6;
    return getPathCode(chart, startAngle, endAngle);
  };

  function getPathCode(chart, startAngle, endAngle) {
    // if we still need to animate the chart -> reset endAngle
    if(!chart.chartLoaded && chart.options.animate && intersectionObserver && ! reducedMotion) {
      endAngle = startAngle;
    }
    if(chart.options.type == 'pie') {
      return getPieArc(chart.width/2, chart.width/2, chart.width/2, startAngle, endAngle);
    } else { //donut
      return getDonutArc(chart.width/2, chart.width/2, chart.width/2, chart.donutSize, startAngle, endAngle);
    }
  };

  function initTooltip(chart) {
    if(chart.tooltip.length < 1) return;
    // init mouse events
    chart.eventIds['hover'] = handleEvent.bind(chart);
    chart.chartArea.addEventListener('mouseenter', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousedown', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousemove', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mouseleave', chart.eventIds['hover']);
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mouseenter':
      case 'mousedown':
        hoverChart(this, event);
        break;
      case 'mousemove': 
        var self = this;
        self.hoverId  = window.requestAnimationFrame 
          ? window.requestAnimationFrame(function(){hoverChart(self, event)})
          : setTimeout(function(){hoverChart(self, event);});
        break;
      case 'mouseleave':
        resetTooltip(this);
        break;
    }
  };

  function hoverChart(chart, event) {
    if(chart.hovering) return;
    chart.hovering = true;
    var selectedIndex = getSelectedIndex(event);
    if(selectedIndex !== false && selectedIndex !== chart.selectedIndex) {
      chart.selectedIndex = selectedIndex;
      setTooltipContent(chart);
      placeTooltip(chart);
      Util.removeClass(chart.tooltip[0], 'is-hidden');
    }
    chart.hovering = false;
  };

  function resetTooltip(chart) {
    if(chart.hoverId) {
      (window.requestAnimationFrame) ? window.cancelAnimationFrame(chart.hoverId) : clearTimeout(chart.hoverId);
      chart.hoverId = false;
    }
    Util.addClass(chart.tooltip[0], 'is-hidden');
    chart.hovering = false;
    chart.selectedIndex = false;
  };

  function placeTooltip(chart) {
    var tooltipRadialPosition = (chart.options.type == 'donut') ? (chart.width - chart.donutSize)/2 : chart.width/4;
    var pathCenter = polarToCartesian(chart.width/2, chart.width/2, tooltipRadialPosition, chart.percentageStart[chart.selectedIndex] + chart.percentageDelta[chart.selectedIndex]/2);

    chart.tooltip[0].setAttribute('style', 'left: '+pathCenter.x+'px; top: '+pathCenter.y+'px');
  };

  function setTooltipContent(chart) {
    chart.tooltip[0].textContent = chart.dataValues[chart.selectedIndex].textContent;
  };

  function getSelectedIndex(event) {
    if(event.target.tagName.toLowerCase() == 'path') {
      return parseInt(event.target.getAttribute('data-index'));
    }
    return false;
  };

  function resizeChart(chart) {
    window.addEventListener('resize', function() {
      clearTimeout(chart.eventIds['resize']);
      chart.eventIds['resize'] = setTimeout(doneResizing, 300);
    });

    function doneResizing() {
      resetChartResize(chart);
      removeChart(chart);
      createChart(chart);
      initTooltip(chart);
    };
  };

  function resetChartResize(chart) {
    chart.hovering = false;
    // reset event listeners
    if( chart.eventIds && chart.eventIds['hover']) {
      chart.chartArea.removeEventListener('mouseenter', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousedown', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousemove', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mouseleave', chart.eventIds['hover']);
    }
  };

  function removeChart(chart) {
    // on resize -> remove svg and create a new one
    chart.svg.remove();
  };

  function animateChart(chart) {
    if(!chart.options.animate || chart.chartLoaded || reducedMotion || !intersectionObserver) return;
    var observer = new IntersectionObserver(chartObserve.bind(chart), {rootMargin: "0px 0px -200px 0px"});
    observer.observe(chart.element);
  };

  function chartObserve(entries, observer) { // observe chart position -> start animation when inside viewport
    if(entries[0].isIntersecting) {
      this.chartLoaded = true;
      animatePath(this);
      observer.unobserve(this.element);
    }
  };

  function animatePath(chart, type) {
    var currentTime = null,
      duration = 400/chart.dataValues.length;
        
    var animateSinglePath = function(index, timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      var startAngle = chart.percentageStart[index];
      var endAngle =  startAngle + chart.percentageDelta[index]*(progress/duration);

      var path = chart.element.getElementsByClassName('js-pie-chart__data-path--'+(index+1))[0];
      var pathCode = getPathCode(chart, startAngle, endAngle);
      path.setAttribute('d', pathCode);
      
      if(progress < duration) {
        window.requestAnimationFrame(function(timestamp) {animateSinglePath(index, timestamp);});
      } else if(index < chart.dataValues.length - 1) {
        currentTime = null;
        window.requestAnimationFrame(function(timestamp) {animateSinglePath(index + 1, timestamp);});
      }
    };

    window.requestAnimationFrame(function(timestamp) {animateSinglePath(0, timestamp);});
  };

  // util functions - get paths d values
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  function getPieArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        "L", x,y,
        "L", start.x, start.y
    ].join(" ");

    return d;       
  };

  function getDonutArc(x, y, radius, radiusDelta, startAngle, endAngle){
    var s1 = polarToCartesian(x, y, (radius - radiusDelta), endAngle),
      s2 = polarToCartesian(x, y, radius, endAngle),
      s3 = polarToCartesian(x, y, radius, startAngle),
      s4 = polarToCartesian(x, y, (radius - radiusDelta), startAngle);


    var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    var d = [
        "M", s1.x, s1.y,
        "L", s2.x, s2.y, 
        "A", radius, radius, 0, arcSweep, 0, s3.x, s3.y, 
        "L", s4.x, s4.y, 
        "A", (radius - radiusDelta), (radius - radiusDelta), 0, arcSweep, 1, s1.x, s1.y
    ].join(" ");

    return d;       
  };

  PieChart.defaults = {
    element : '',
    type: 'pie', // can be pie or donut
    animate: false
  };

  window.PieChart = PieChart;

  //initialize the PieChart objects
  var pieCharts = document.getElementsByClassName('js-pie-chart');
  var intersectionObserver = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
  
  if( pieCharts.length > 0 ) {
    for( var i = 0; i < pieCharts.length; i++) {
      (function(i){
        var chartType = pieCharts[i].getAttribute('data-pie-chart-type') ? pieCharts[i].getAttribute('data-pie-chart-type') : 'pie';
        var animate = pieCharts[i].getAttribute('data-pie-chart-animation') && pieCharts[i].getAttribute('data-pie-chart-animation') == 'on' ? true : false;
        new PieChart({
          element: pieCharts[i],
          type: chartType,
          animate: animate
        });
      })(i);
    }
  }
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
    this.elementId = this.element.getAttribute('id');
    this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
    this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
    this.lastFocusable = false;
    // position target - position tooltip relative to a specified element
    this.positionTarget = getPositionTarget(this);
    // gap between element and viewport - if there's max-height 
    this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
    initPopover(this);
    initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

  // private methods
  function getPositionTarget(popover) {
    // position tooltip relative to a specified element - if provided
    var positionTargetSelector = popover.element.getAttribute('data-position-target');
    if(!positionTargetSelector) return false;
    var positionTarget = document.querySelector(positionTargetSelector);
    return positionTarget;
  };

  function initPopover(popover) {
    // init aria-labels
    for(var i = 0; i < popover.trigger.length; i++) {
      Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
    }
  };
  
  function initPopoverEvents(popover) {
    for(var i = 0; i < popover.trigger.length; i++) {(function(i){
      popover.trigger[i].addEventListener('click', function(event){
        event.preventDefault();
        // if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
        if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
          togglePopover(popover, false, false); // close menu
        }
        // toggle popover
        popover.selectedTrigger = popover.trigger[i];
        togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
      });
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });

    // custom events -> open/close popover
    popover.element.addEventListener('openPopover', function(event){
      togglePopover(popover, true);
    });

    popover.element.addEventListener('closePopover', function(event){
      togglePopover(popover, false, event.detail);
    });
  };
  
  function togglePopover(popover, bool, moveFocus) {
    // toggle popover visibility
    Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
    popover.popoverIsOpen = bool;
    if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
      popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
      // position the popover element
      positionPopover(popover);
      // add class to popover trigger
      Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
    } else if(popover.selectedTrigger) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'false');
      if(moveFocus) Util.moveFocus(popover.selectedTrigger);
      // remove class from menu trigger
      Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
      popover.selectedTrigger = false;
    }
  };
  
  function focusPopover(popover) {
    if(popover.firstFocusable) {
      popover.firstFocusable.focus();
    } else {
      Util.moveFocus(popover.element);
    }
  };

  function positionPopover(popover) {
    // reset popover position
    resetPopoverStyle(popover);
    var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
    
    var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
      
    var left = selectedTriggerPosition.left,
      right = (window.innerWidth - selectedTriggerPosition.right),
      isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

    var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
      vertical = menuOnTop
        ? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
        : 'top: '+selectedTriggerPosition.bottom+'px;';
    // check right position is correct -> otherwise set left to 0
    if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
    // check if popover needs a max-height (user will scroll inside the popover)
    var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

    var initialStyle = popover.element.getAttribute('style');
    if(!initialStyle) initialStyle = '';
    popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
  };
  
  function resetPopoverStyle(popover) {
    // remove popover inline style before appling new style
    popover.element.style.maxHeight = '';
    popover.element.style.top = '';
    popover.element.style.bottom = '';
    popover.element.style.left = '';
    popover.element.style.right = '';
  };

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
    var allFocusable = popover.element.querySelectorAll(focusableElString);
    getFirstVisible(popover, allFocusable);
    getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
    //get first visible focusable element inside the popover
    for(var i = 0; i < elements.length; i++) {
      if( isVisible(elements[i]) ) {
        popover.firstFocusable = elements[i];
        break;
      }
    }
  };

  function getLastVisible(popover, elements) {
    //get last visible focusable element inside the popover
    for(var i = elements.length - 1; i >= 0; i--) {
      if( isVisible(elements[i]) ) {
        popover.lastFocusable = elements[i];
        break;
      }
    }
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of popover
      event.preventDefault();
      popover.lastFocusable.focus();
    }
    if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of popover
      event.preventDefault();
      popover.firstFocusable.focus();
    }
  };
  
  function isVisible(element) {
    // check if element is visible
    return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
  };

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
  
  if( popovers.length > 0 ) {
    var popoversArray = [];
    var scrollingContainers = [];
    for( var i = 0; i < popovers.length; i++) {
      (function(i){
        popoversArray.push(new Popover(popovers[i]));
        var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
        if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
      })(i);
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
        popoversArray.forEach(function(element){
          element.checkPopoverFocus();
        });
      } 
    });
    // close popover when clicking outside it
    window.addEventListener('click', function(event){
      popoversArray.forEach(function(element){
        element.checkPopoverClick(event.target);
      });
    });
    // on resize -> close all popover elements
    window.addEventListener('resize', function(event){
      popoversArray.forEach(function(element){
        element.togglePopover(false, false);
      });
    });
    // on scroll -> close all popover elements
    window.addEventListener('scroll', function(event){
      popoversArray.forEach(function(element){
        if(element.popoverIsOpen) element.togglePopover(false, false);
      });
    });
    // take into account additinal scrollable containers
    for(var j = 0; j < scrollingContainers.length; j++) {
      var scrollingContainer = document.querySelector(scrollingContainers[j]);
      if(scrollingContainer) {
        scrollingContainer.addEventListener('scroll', function(event){
          popoversArray.forEach(function(element){
            if(element.popoverIsOpen) element.togglePopover(false, false);
          });
        });
      }
    }
  }
}());
// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
  var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
      observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
  if( timelines.length > 0) {
    for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
    }
  }
}());
// File#: _2_adv-custom-select
// Usage: codyhouse.co/license
(function() {
  var AdvSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.optionData = getOptionsData(this);
    this.selectId = this.select.getAttribute('id');
    this.selectLabel = document.querySelector('[for='+this.selectId+']')
    this.trigger = this.element.getElementsByClassName('js-adv-select__control')[0];
    this.triggerLabel = this.trigger.getElementsByClassName('js-adv-select__value')[0];
    this.dropdown = document.getElementById(this.trigger.getAttribute('aria-controls'));

    initAdvSelect(this); // init markup
    initAdvSelectEvents(this); // init event listeners
  };

  function getOptionsData(select) {
    var obj = [],
      dataset = select.options[0].dataset;

    function camelCaseToDash( myStr ) {
      return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        // obj[prop] = select.dataset[prop];
        obj.push(camelCaseToDash(prop));
      }
    }
    return obj;
  };

  function initAdvSelect(select) {
    // create custom structure
    createAdvStructure(select);
    // update trigger label
    updateTriggerLabel(select);
    // hide native select and show custom structure
    Util.addClass(select.select, 'is-hidden');
    Util.removeClass(select.trigger, 'is-hidden');
    Util.removeClass(select.dropdown, 'is-hidden');
  };

  function initAdvSelectEvents(select) {
    if(select.selectLabel) {
      // move focus to custom trigger when clicking on <select> label
      select.selectLabel.addEventListener('click', function(){
        select.trigger.focus();
      });
    }

    // option is selected in dropdown
    select.dropdown.addEventListener('click', function(event){
      triggerSelection(select, event.target);
    });

    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      } else if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        triggerSelection(select, document.activeElement);
      }
    });
  };

  function createAdvStructure(select) {
    // store optgroup and option structure
    var optgroup = select.dropdown.querySelector('[role="group"]'),
      option = select.dropdown.querySelector('[role="option"]'),
      optgroupClone = false,
      optgroupLabel = false,
      optionClone = false;
    if(optgroup) {
      optgroupClone = optgroup.cloneNode();
      optgroupLabel = document.getElementById(optgroupClone.getAttribute('describedby'));
    }
    if(option) optionClone = option.cloneNode(true);

    var dropdownCode = '';

    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        dropdownCode = dropdownCode + getOptGroupCode(select, select.optGroups[i], optgroupClone, optionClone, optgroupLabel, i);
      }
    } else {
      for(var i = 0; i < select.options.length; i++) {
        dropdownCode = dropdownCode + getOptionCode(select, select.options[i], optionClone);
      }
    }

    select.dropdown.innerHTML = dropdownCode;
  };

  function getOptGroupCode(select, optGroup, optGroupClone, optionClone, optgroupLabel, index) {
    if(!optGroupClone || !optionClone) return '';
    var code = '';
    var options = optGroup.getElementsByTagName('option');
    for(var i = 0; i < options.length; i++) {
      code = code + getOptionCode(select, options[i], optionClone);
    }
    if(optgroupLabel) {
      var label = optgroupLabel.cloneNode(true);
      var id = label.getAttribute('id') + '-'+index;
      label.setAttribute('id', id);
      optGroupClone.setAttribute('describedby', id);
      code = label.outerHTML.replace('{optgroup-label}', optGroup.getAttribute('label')) + code;
    } 
    optGroupClone.innerHTML = code;
    return optGroupClone.outerHTML;
  };

  function getOptionCode(select, option, optionClone) {
    optionClone.setAttribute('data-value', option.value);
    if(option.selected) {
      optionClone.setAttribute('aria-selected', 'true');
      optionClone.setAttribute('tabindex', '0');
    } else {
      optionClone.removeAttribute('aria-selected');
      optionClone.removeAttribute('tabindex');
    }
    var optionHtml = optionClone.outerHTML;
    optionHtml = optionHtml.replace('{option-label}', option.text);
    for(var i = 0; i < select.optionData.length; i++) {
      optionHtml = optionHtml.replace('{'+select.optionData[i]+'}', option.getAttribute('data-'+select.optionData[i]));
    }
    return optionHtml;
  };

  function updateTriggerLabel(select) {
    // select.triggerLabel.textContent = select.options[select.select.selectedIndex].text;
    select.triggerLabel.innerHTML = select.dropdown.querySelector('[aria-selected="true"]').innerHTML;
  };

  function triggerSelection(select, target) {
    var option = target.closest('[role="option"]');
    if(!option) return;
    selectOption(select, option);
  };

  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) {
        selectedOption.removeAttribute('aria-selected');
        selectedOption.removeAttribute('tabindex');
      }
      option.setAttribute('aria-selected', 'true');
      option.setAttribute('tabindex', '0');
      // new option has been selected -> update native <select> element and trigger label
      updateNativeSelect(select, option.getAttribute('data-value'));
      updateTriggerLabel(select);
    }
    // move focus back to trigger
    setTimeout(function(){
      select.trigger.click();
    });
  };

  function updateNativeSelect(select, selectedValue) {
    var selectedOption = select.select.querySelector('[value="'+selectedValue+'"');
    select.select.selectedIndex = Util.getIndexInArray(select.options, selectedOption);
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
  };

  function keyboardCustomSelect(select, direction) {
    var selectedOption = select.select.querySelector('[value="'+document.activeElement.getAttribute('data-value')+'"]');
    if(!selectedOption) return;
    var index = Util.getIndexInArray(select.options, selectedOption);
    
    index = direction == 'next' ? index + 1 : index - 1;
    if(index < 0) return;
    if(index >= select.options.length) return;
    
    var dropdownOption = select.dropdown.querySelector('[data-value="'+select.options[index].getAttribute('value')+'"]');
    if(dropdownOption) Util.moveFocus(dropdownOption);
  };

  //initialize the AdvSelect objects
  var advSelect = document.getElementsByClassName('js-adv-select');
  if( advSelect.length > 0 ) {
    for( var i = 0; i < advSelect.length; i++) {
      (function(i){new AdvSelect(advSelect[i]);})(i);
    }
  }
}());
// File#: _3_light-dark-switch
// Usage: codyhouse.co/license
(function() {
  var LdSwitch = function(element) {
    this.element = element;
    this.icons = this.element.getElementsByClassName('js-ld-switch-icon');
    this.selectedIcon = 0;
    this.isSystem = false;
    // icon animation classes
    this.iconClassIn = 'ld-switch-btn__icon-wrapper--in';
    this.iconClassOut = 'ld-switch-btn__icon-wrapper--out';
    // mediaQueryList
    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this.eventBind = false;
    saveThemeLabels(this);
    initLdSwitch(this);
  };

  function saveThemeLabels(switchOb) {
    switchOb.themes = ['default', 'dark', 'system'];
    switchOb.options = switchOb.element.querySelectorAll('option');

    var lightTheme = switchOb.options[0].getAttribute('data-option-theme'),
      darkTheme = switchOb.options[1].getAttribute('data-option-theme');
    if(lightTheme) switchOb.themes[0] = lightTheme;
    if(darkTheme) switchOb.themes[1] = darkTheme;
  };

  function initLdSwitch(switchOb) {
    // set initail state
    setStartIcon(switchOb);

    // detect change in the selected theme
    switchOb.element.addEventListener('change', function(event){
      setTheme(switchOb, event.target.value);
    });
  };

  function setStartIcon(switchOb) {
    var selectedOptionIndex = switchOb.element.querySelector('select').selectedIndex;
    if(selectedOptionIndex === 0) return;
    setTheme(switchOb, selectedOptionIndex, true);
  };

  function setTheme(switchOb, value, init) {
    var theme = switchOb.themes[0],
      iconIndex = value;

    // update local storage
    localStorage.setItem('ldSwitch', switchOb.themes[value]);

    // get theme value and icon index
    if(value == 1) {
      theme = switchOb.themes[1];
    } else if(value == 2) {
      // user selected system -> check if we should show light or dark theme
      var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if(isDarkTheme) {
        iconIndex = 3;
        theme = switchOb.themes[1];
      }
    }

    // update theme value
    updateThemeValue(theme);

    // update visible icon
    updateIcon(switchOb, iconIndex, switchOb.selectedIcon, init);

    // check if we need to add/remove matchMedia events
    setMatchMediaEvents(switchOb, value == 2, switchOb.isSystem);
    switchOb.isSystem = value == 2 ? true : false;
  };

  function updateIcon(switchOb, newIcon, oldIcon, init) {
    if(init) { // we are only setting the initial status of the switcher
      Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
      Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);
      switchOb.selectedIcon = newIcon;
      return;
    }
    Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
    Util.addClass(switchOb.icons[oldIcon], switchOb.iconClassOut);

    Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);

    switchOb.icons[newIcon].addEventListener('transitionend', function cb(){
      Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassOut);
      switchOb.icons[newIcon].removeEventListener('transitionend', cb);
      switchOb.selectedIcon = newIcon;
    });
  };

  function updateThemeValue(theme) {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
  };

  function setMatchMediaEvents(switchOb, addEvent, removeEvent) {
    if(addEvent) {
      switchOb.eventBind = systemUpdated.bind(switchOb);
      switchOb.mediaQueryList.addEventListener("change", switchOb.eventBind);
    } else if(removeEvent) switchOb.mediaQueryList.removeEventListener("change", switchOb.eventBind);
  };

  function systemUpdated() {
    var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = isDarkTheme ? this.themes[1] : this.themes[0],
      newIndex = isDarkTheme ? 3 : 2,
      oldIcon = isDarkTheme ? 2 : 3;
    updateIcon(this, newIndex, oldIcon);
    updateThemeValue(theme);
  };

  window.LdSwitch = LdSwitch;
  var ldSwitches = document.getElementsByClassName('js-ld-switch');
  if( ldSwitches.length > 0 ) {
    for( var i = 0; i < ldSwitches.length; i++) {
      new LdSwitch(ldSwitches[i]);
    }
  }
}());