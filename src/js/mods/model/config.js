/**
 * @fileoverview 控制参数
 * @authors liangdong2  <pillar0514@gmail.com>
 */

define('mods/model/config',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var CACHE_KEY = 'lucky_draw_configs';

	var Config = $model.extend({
		defaults : {
			//显示设置面板
			showSettings : false,
			//待抽奖数据
			lotteryData : null,
			//待抽奖奖票数量
			lotteryCount : 100,
			//本轮可抽取数量
			drawCount : 1
		},
		events : {
			'change' : 'save'
		},
		build : function(){
			var that = this;
			this.load();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
		},
		//从缓存加载数据
		load : function(){
			var data;
			var strData = localStorage.getItem(CACHE_KEY);
			try{
				data = JSON.parse(strData);
			}catch(e){}
			if($.isPlainObject(data)){
				this.set(data);
			}
		},
		//将数据存入缓存
		save : function(){
			var data = this.get();
			delete data.showSettings;
			localStorage.setItem(CACHE_KEY, JSON.stringify(data));
		}
	});

	module.exports = new Config();

});

