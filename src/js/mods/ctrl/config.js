/**
 * @fileoverview 控制台
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/ctrl/config',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $controller = require('lib/mvc/controller');
	var $configView = require('mods/view/config');
	var $configModel = require('mods/model/config');
	var $channel = require('mods/channel/global');
	var $lotteryModel = require('mods/model/lotteryBox');

	//设置面板
	var Config = $controller.extend({
		defaults : {
			minDrawCount : 1,
			maxDrawCount : 16
		},
		build : function(){
			this.view = new $configView();
			this.checkSettings();
		},
		setEvents : function(){
			var doc = $(document);
			var proxy = this.proxy();
			doc.on('keydown', proxy('handelKeydown'));
			$configModel.on('change:showSettings', proxy('checkSettings'));
		},
		handelKeydown : function(evt){
			var ctrl = evt.ctrlKey;
			var alt = evt.altKey;
			var keyCode = evt.keyCode.toString();
			var activeTag = document.activeElement.tagName.toLowerCase();
			
			if(activeTag !== 'body'){
				//避免捕捉input上的keydown事件
				return;
			}
			if(keyCode === '38'){
				//向上箭头
				this.increaseDrawCount();
			}else if(keyCode === '40'){
				//向下箭头
				this.decreaseDrawCount();
			}else if(keyCode === '67'){
				//按键c
				this.toggleSettings();
			}else if(keyCode === '80'){
				//按键p
				$channel.trigger('toggle-winning-list');
			}else if(keyCode === '77'){
				//按键m
				this.toggleMusic();
			}
		},
		toggleMusic : function(){
			$channel.trigger('toggle-music');
		},
		toggleSettings : function(){
			var visible = $configModel.get('showSettings');
			$configModel.set('showSettings', !visible);
		},
		checkSettings : function(){
			var view = this.view;
			var visible = $configModel.get('showSettings');
			if(visible){
				view.showSettings();
			}else{
				view.hideSettings();
			}
		},
		increaseDrawCount : function(){
			var conf = this.conf;
			var count = $configModel.get('drawCount');
			count ++;
			count = $limit(conf.minDrawCount, count, conf.maxDrawCount);
			$configModel.set('drawCount', count);
		},
		decreaseDrawCount : function(){
			var conf = this.conf;
			var count = $configModel.get('drawCount');
			count --;
			count = $limit(conf.minDrawCount, count, conf.maxDrawCount);
			$configModel.set('drawCount', count);
		}
	});

	module.exports = new Config();

});
