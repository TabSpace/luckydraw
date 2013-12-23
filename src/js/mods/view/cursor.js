/**
 * @fileoverview 模拟光标
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/cursor',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $cursorModel = require('mods/model/cursor');

	//光标
	var Cursor = $view.extend({
		defaults : {
			node : '#cursor'
		},
		build : function(){
			this.root = this.role('root');
			this.root.show();
		},
		setEvents : function(action){
			var doc = $(document);
			var proxy = this.proxy();
			this.delegate(action);
			doc.on('mousemove', proxy('setPos'));
			$cursorModel.on('change:x', proxy('move'));
			$cursorModel.on('change:y', proxy('move'));
		},
		show : function(){

		},
		hide : function(){

		},
		setPos : function(evt){
			$cursorModel.set('x', evt.pageX);
			$cursorModel.set('y', evt.pageY);
		},
		move : function(){
			var root = this.root;
			var delta = this.delta;
			var x = $cursorModel.get('x');
			var y = $cursorModel.get('y');
			root.css({
				'left' : x + 'px',
				'top' : y + 'px'
			});
		}
	});

	module.exports = new Cursor();

});
