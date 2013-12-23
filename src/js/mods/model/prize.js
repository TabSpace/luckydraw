/**
 * @fileoverview 奖品
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/model/prize',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $channel = require('mods/channel/global');

	var CACHE_KEY = 'lucky_draw_prize';

	var getUniqueKey = function(){
		return (+ new Date()).toString(16);
	};

	//奖品列表
	var prizeList = [];

	var Prize = $model.extend({
		defaults : {
			prizeNo : 0
		},
		events : {
			'save' : 'save'
		},
		build : function(){
			this.load();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
		},
		getNo : function(){
			this.set('prizeNo', this.get('prizeNo') + 1);
			return this.get('prizeNo');
		},
		add : function(id){
			var item = {};
			item.id = 'p' + getUniqueKey();
			item.name = '奖品' + this.getNo();
			item.count = 0;
			prizeList.push(item);
			this.trigger('change:list');
		},
		remove : function(id){
			var index = 0;
			prizeList.forEach(function(item, i){
				if(item.id === id){
					index = i;
					return false;
				}
			});
			prizeList.splice(index, 1);
			this.trigger('change:list');
		},
		move : function(id, dir){
			var index = 0;
			var moveItem;
			prizeList.forEach(function(item, i){
				if(item.id === id){
					index = i;
					moveItem = item;
					return false;
				}
			});

			if(!moveItem){return;}
			prizeList.splice(index, 1);
			if(dir === 'up'){
				prizeList.splice(Math.max(index - 1, 0), 0, moveItem);
			}else if(dir === 'down'){
				prizeList.splice(index + 1, 0, moveItem);
			}
			this.trigger('change:list');
		},
		getList : function(copy){
			return copy ? $.extend(true, [], prizeList) : prizeList;
		},
		//更新数据
		update : function(data){
			if(!$.isPlainObject(data)){return;}
			prizeList.forEach(function(item){
				if(data[item.id]){
					item.name = data[item.id];
				}
			});
			this.trigger('change:list');
			this.trigger('save');
		},
		//更新中奖数量数据
		updateCount : function(winning){
			if(!prizeList.length){return;}
			var hash = prizeList.reduce(function(obj, item){
				obj[item.id] = item;
				return obj;
			}, {});

			$.each(hash, function(key, item){
				item.count = 0;
			});
			if(winning.length){
				winning.forEach(function(witem){
					var key = witem.prize;
					var item = hash[key];
					if(item){
						item.count ++;
					}
				});
			}
			this.trigger('save');
		},
		//保存数据
		save : function(){
			var model = this.get();
			var data = {};
			data.model = model;
			data.list = prizeList;
			var str = JSON.stringify(data);
			localStorage.setItem(CACHE_KEY, str);
		},
		//加载数据
		load : function(){
			try{
				var str = localStorage.getItem(CACHE_KEY);
				var data = JSON.parse(str);
				this.set(data.model);
				prizeList.length = 0;
				while(data.list.length){
					prizeList.push(data.list.shift());
				}
			}catch(e){}
		}
	});

	module.exports = new Prize();

});

