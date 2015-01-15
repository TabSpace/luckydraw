/**
 * @fileoverview 控制盒子UI
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/view/ctrlBox',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $model = require('lib/mvc/model');
	var $channel = require('mods/channel/global');
	var $ctrlBoxModel = require('mods/model/ctrlBox');

	//设置面板
	var CtrlBox = $view.extend({
		defaults : {
			node : '#draw-ctrl',
			events : {
				'[data-role="ok"] click' : 'ok'
			}
		},
		build : function(){
			var conf = this.conf;
			this.root = this.role('root');
			this.checkVisible();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$ctrlBoxModel.on('change:visible', proxy('checkVisible'));
		},
		checkVisible : function(){
			var root = this.root;
			var visible = $ctrlBoxModel.get('visible');
			if(visible){
				root.addClass('open');
			}else{
				root.removeClass('open');
			}
		},
		ok : function(){
			$channel.trigger('pick-ok');
		}
	});

	module.exports = new CtrlBox();

});