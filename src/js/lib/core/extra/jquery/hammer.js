/**
 * @fileoverview 利用hammer.js增强多点触摸交互
 * @authors liangdong2 
 */
define('lib/core/extra/jquery/hammer',function(require,exports,module){

	var $ = require('lib/core/jquery/jquery');
	var Hammer = require('vendor/hammer/hammer');

	/**
	 * bind dom events
	 * this overwrites addEventListener
	 * @param   {HTMLElement}	element
	 * @param   {String}		eventTypes
	 * @param   {Function}		handler
	 */
	Hammer.event.bindDom = function(element, eventTypes, handler) {
		$(element).on(eventTypes, function(ev) {
			var data = ev.originalEvent || ev;

			// IE pageX fix
			if(data.pageX === undefined) {
				data.pageX = ev.pageX;
				data.pageY = ev.pageY;
			}

			// IE target fix
			if(!data.target) {
				data.target = ev.target;
			}

			// IE button fix
			if(data.which === undefined) {
				data.which = data.button;
			}

			// IE preventDefault
			if(!data.preventDefault) {
				data.preventDefault = ev.preventDefault;
			}

			// IE stopPropagation
			if(!data.stopPropagation) {
				data.stopPropagation = ev.stopPropagation;
			}

			handler.call(this, data);
		});
	};

	/**
	 * the methods are called by the instance, but with the jquery plugin
	 * we use the jquery event methods instead.
	 * @this	{Hammer.Instance}
	 * @return  {jQuery}
	 */
	Hammer.Instance.prototype.on = function(types, handler) {
		return $(this.element).on(types, handler);
	};
	Hammer.Instance.prototype.off = function(types, handler) {
		return $(this.element).off(types, handler);
	};


	/**
	 * trigger events
	 * this is called by the gestures to trigger an event like 'tap'
	 * @this	{Hammer.Instance}
	 * @param   {String}	gesture
	 * @param   {Object}	eventData
	 * @return  {jQuery}
	 */
	Hammer.Instance.prototype.trigger = function(gesture, eventData){
		var el = $(this.element);
		if(el.has(eventData.target).length) {
			el = $(eventData.target);
		}

		return el.trigger({
			type: gesture,
			gesture: eventData
		});
	};


	/**
	 * jQuery plugin
	 * create instance of Hammer and watch for gestures,
	 * and when called again you can change the options
	 * @param   {Object}	[options={}]
	 * @return  {jQuery}
	 */
	$.fn.hammer = function(options) {
		return this.each(function() {
			var el = $(this);
			var inst = el.data('hammer');
			// start new hammer instance
			if(!inst) {
				el.data('hammer', new Hammer(this, options || {}));
			}
			// change the options
			else if(inst && options) {
				Hammer.utils.extend(inst.options, options);
			}
		});
	};

	//自定义部分
	$(function(){
		$(document.body).hammer({
			//允许用户选中文字
			stop_browser_behavior : {
				userSelect : ''
			},

			//使tap事件更容易触发
			tap_max_touchtime	: 350,

			//使swip事件更容易触发
			swipe_velocity : 0.2
		});
	});

});

