/**
 * @fileoverview 被选中彩票所在的盒子
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/model/pickedBox',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $channel = require('mods/channel/global');

	var PickedBox = $model.extend({
		defaults : {
			//是否已经洗过一次牌
			shuffled : false,
			//是否正在执行洗牌动画
			shuffling : false,
			//是否正在执行庆祝动画
			celebrating : false,
			//是否正在执行沮丧动画
			depressing : false,
			//正在执行放回彩票的动画
			putbacking : false,
			//是否显示选中彩票的背景盒子
			showBoxBg : false
		},
		build : function(){

		},
		setEvents : function(action){
			this.delegate(action);
		}
	});

	module.exports = new PickedBox();

});

