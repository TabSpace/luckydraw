/**
 * @fileoverview 控制台UI
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/config',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $view = require('lib/mvc/view');
	var $configModel = require('mods/model/config');
	var $channel = require('mods/channel/global');

	//设置面板
	var Config = $view.extend({
		defaults : {
			node : '#config-panel',
			events : {
				'[data-role="count"] input' : 'limitLotterys',
				'[data-role="reset"] click' : 'checkReset',
				'[data-role="ok"] click' : 'renderLotteryBox',
				'[data-role="cancel"] click' : 'cancelReset'
			}
		},
		build : function(){
			var conf = this.conf;
			this.root = this.role('root');
			this.elDrawCount = $('#draw-count');
			this.role('reset').blur();

			this.renderDrawCount();
			this.renderLotteryCount();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$configModel.on('change:drawCount', proxy('renderDrawCount'));
			$configModel.on('change:lotteryCount', proxy('renderLotteryCount'));
		},
		//渲染可抽取数量
		renderDrawCount : function(){
			var count = $configModel.get('drawCount');
			this.elDrawCount.html(count);
		},
		//渲染待抽奖奖票数量
		renderLotteryCount : function(){
			var count = $configModel.get('lotteryCount');
			this.role('count').val(count);
		},
		showSettings : function(){
			this.root.addClass('open');
		},
		hideSettings : function(){
			this.root.removeClass('open');
		},
		limitLotterys : function(){
			var input = this.role('count');
			var val = parseInt(input.val(), 10) || 0;
			var min = parseInt(input.attr('min'), 10) || 0;
			var max = parseInt(input.attr('max'), 10) || 10000;
			val = $limit(val, min, max);
			input.val(val);
		},
		checkReset : function(){
			this.role('reset').hide();
			this.role('confirm').show();
		},
		renderLotteryBox : function(){
			var count = this.role('count').val();
			count = parseInt(count, 10) || $configModel.get('lotteryCount');
			$configModel.set('lotteryCount', count);

			$channel.trigger('reset');
			this.role('confirm').hide();
			this.role('reset').show();
			this.showTip('已重置奖项，所有抽奖数据清空。');
		},
		cancelReset : function(){
			this.role('count').val(
				$configModel.get('lotteryCount')
			);
			this.role('confirm').hide();
			this.role('reset').show();
			this.showTip('已恢复为上一次抽奖后的状态。');
		},
		showTip : function(str){
			$channel.trigger('tip', str);
		}
	});

	module.exports = Config;

});
