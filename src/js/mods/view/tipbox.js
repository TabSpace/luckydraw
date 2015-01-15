/**
 * @fileoverview 信息提示盒子
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/view/tipbox',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $channel = require('mods/channel/global');

	//信息盒子
	var TipBox = $view.extend({
		defaults : {
			node : '#tip-box'
		},
		setEvents : function(action){
			var proxy = this.proxy();
			$channel.on('tip', proxy('show'));
		},
		show : function(str){
			var root = this.role('root');
			root.html(str);
			if(!str){return;}
			root.css('animation', 'none')
				.reflow()
				.transit('show-tip', 3000);
		}
	});

	module.exports = new TipBox();

});
