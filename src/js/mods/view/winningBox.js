/**
 * @fileoverview 中奖列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/winningBox',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $mustache = require('lib/more/mustache');
	var $channel = require('mods/channel/global');
	var $lotteryModel = require('mods/model/lotteryBox');

	var TPL = {
		list : [
			'{{#.}}',
				'<div class="box">',
					'<h3 class="title">{{prizeName}}</h3>',
					'<ul class="list">',
						'{{#items}}',
							'<li>{{id}}</li>',
						'{{/items}}',
					'</ul>',
				'</div>',
			'{{/.}}'
		].join('')
	};

	//中奖列表
	var WinningBox = $view.extend({
		defaults : {
			node : '#winning-box'
		},
		build : function(){
			this.vm = new $model({
				visible : false
			});
			this.root = this.role('root');
			this.render();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var vm = this.vm;
			$channel.on('toggle-winning-list', proxy('toggle'));
			$channel.on('decided', proxy('render'));
			$channel.on('reset', proxy('render'));
			vm.on('change:visible', proxy('checkVisible'));
		},
		toggle : function(){
			this.vm.set('visible', !this.vm.get('visible'));
		},
		checkVisible : function(){
			var visible = this.vm.get('visible');
			if(visible){
				this.render();
				this.root.addClass('open');
			}else{
				this.root.removeClass('open');
			}
		},
		render : function(){
			var winning = $lotteryModel.getWinning(true);
			winning = $.extend(true, [], winning);

			var data = [];

			var html = $mustache.render(TPL.list, data);
			this.role('panel').html(html);
		}
	});

	module.exports = new WinningBox();

});
