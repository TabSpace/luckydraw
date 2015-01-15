/**
 * @fileoverview 控制盒子模型
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/model/ctrlBox',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $channel = require('mods/channel/global');
	var $sceneModel = require('mods/model/scene');
	var $lotteryModel = require('mods/model/lotteryBox');
	var $pickedBoxModel = require('mods/model/pickedBox');

	var CtrlBox = $model.extend({
		defaults : {
			visible : false
		},
		build : function(){
			this.checkVisible();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$lotteryModel.on('change:state', proxy('checkVisible'));
			$pickedBoxModel.on('change', proxy('checkVisible'));
		},
		checkVisible : function(){
			var visible = false;
			var state = $lotteryModel.get('state');
			var shuffled = $pickedBoxModel.get('shuffled');
			var shuffling = $pickedBoxModel.get('shuffling');
			var celebrating = $pickedBoxModel.get('celebrating');
			var depressing = $pickedBoxModel.get('depressing');
			var putbacking = $pickedBoxModel.get('putbacking');

			if(
				state === 'picked' && shuffled &&
				!shuffling && !celebrating &&
				!depressing && !putbacking
			){
				visible = true;
			}

			this.set('visible', visible);
		}
	});

	module.exports = new CtrlBox();

});
