/**
 * @fileoverview 模拟光标
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/model/cursor',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var $win = $(window);

	var Cursor = $model.extend({
		defaults : {
			x : 0,
			y : 0,
			visible : false
		},
		events : {

		},
		build : function(){

		},
		setEvents : function(action){
			this.delegate(action);
		},
		checkVisible : function(){

		}
	});

	module.exports = new Cursor();

});

