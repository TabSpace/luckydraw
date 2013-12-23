/**
 * @fileoverview 控制参数
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */

define('mods/model/config',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $prizeModel = require('mods/model/prize');

	var CACHE_KEY = 'lucky_draw_configs';

	var Config = $model.extend({
		defaults : {
			//当前奖品
			currentPrize : '',
			//显示设置面板
			showSettings : false,
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
			this.checkCurrent();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$prizeModel.on('save', proxy('checkCurrent'));
			this.on('change:current', proxy('checkCurrent'));
		},
		//切换当前奖品名称
		switchPrize : function(dir){
			var prizeList = $prizeModel.getList(true);
			if(!prizeList.length){return;}

			var idList = prizeList.map(function(item){
				return item.id;
			});

			var current = this.get('currentPrize');
			var index = idList.indexOf(current);
			if(index < 0){
				index = 0;
			}
			if(dir === 'right'){
				index = index + 1;
			}else if(dir === 'left'){
				index = index - 1;
			}
			if(index === -1){
				index = prizeList.length - 1;
			}
			if(index === prizeList.length){
				index = 0;
			}

			var item = prizeList[index];
			if(item){
				current = item.id;
			}

			this.set('currentPrize', current);
		},
		//检查奖品名称
		checkCurrent : function(){
			var prizeList = $prizeModel.getList(true);
			var current = this.get('currentPrize');
			var idList = [];
			if(prizeList.length){
				idList = prizeList.map(function(item){
					return item.id;
				});
				if(!current){
					current = prizeList[prizeList.length - 1].id;
					this.set('currentPrize', current);
				}else{
					if(idList.indexOf(current) < 0){
						current = prizeList[prizeList.length - 1].id;
						this.set('currentPrize', current);
					}
				}
			}else{
				this.set('currentPrize', '');
			}
		},
		//获取当前奖品数据
		getCurrentPrize : function(copy){
			var current = this.get('currentPrize');
			var prizeList = $prizeModel.getList(true);
			var ids = prizeList.map(function(item){
				return item.id;
			});
			var index = ids.indexOf(current);
			var currentItem;
			if(index >= 0){
				currentItem = !copy ? prizeList[index] :
					$.extend(true, {}, prizeList[index]);
				return currentItem;
			}
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

