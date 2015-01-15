/**
 * @fileoverview touch 环境检测
 * @authors liangdong2 
 */

define('lib/kit/env/touch',function(require,exports,module){

	var touchEnable = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	module.exports = {
		//是否支持touch
		enable : touchEnable
	};

});


