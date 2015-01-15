/**
 * @fileoverview 动画场景模型
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/model/scene',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $channel = require('mods/channel/global');

	var CACHE_KEY = 'lucky_draw_scene';

	var Scene = $model.extend({
		defaults : {
			speedX : 10,
			speedY : 10,
			speedZ : 10,
			//正在摇奖的状态
			rolling : false
		},
		build : function(){

		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
		}
	});

	module.exports = new Scene();

});

