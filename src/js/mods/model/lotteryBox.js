/**
 * @fileoverview 彩票盒子
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/model/lotteryBox',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $configModel = require('mods/model/config');
	var $channel = require('mods/channel/global');

	var CACHE_KEY = 'lucky_draw_lotterys';

	var lotterys = {
		//奖箱中的彩票
		prepared : [],
		//被挑中的彩票
		picked : [],
		//中奖的彩票
		winning : []
	};

	//彩票盒子模型
	//抽奖的核心模型
	var LotteryBox = $model.extend({
		defaults : {
			//摇奖滚动间隔时间
			rollingInterval : 60,
			//抽奖状态
			state : 'ready'
		},
		events : {
			'change:state' : 'checkState'
		},
		build : function(){
			this.load();
			this.initData();
			this.checkState();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$channel.on('reset', proxy('reset'));
			$channel.on('decide', proxy('selectWinning'));
			$channel.on('lottery-turn', proxy('save'));
			$channel.on('clean-picked', proxy('cleanPicked'));
		},
		//重置彩票数据
		reset : function(){
			lotterys = {
				prepared : [],
				winning : [],
				picked : []
			};
			this.set(this.defaults);
			this.initData();
		},
		//初始化数据
		//当不存在任何彩票数据时，初始化彩票数据
		initData : function(){
			var lotteryCount = $configModel.get('lotteryCount');
			var i;
			var prepared = lotterys.prepared;
			var winning = lotterys.winning;
			var picked = lotterys.picked;
			if(!prepared.length && !winning.length && !picked.length){
				for(i = 0; i < lotteryCount; i++){
					prepared.push({
						id : i + 1
					});
				}
			}
			this.sortPreparedData();
			this.save();
		},
		//随机排序还在奖箱中的数据
		sortPreparedData : function(){
			//先随机排序一次
			var prepared = lotterys.prepared;
			var arr = prepared.slice(0);
			var index;

			prepared.length = 0;
			while(arr.length){
				index = Math.floor(Math.random() * arr.length);
				prepared.push(arr[index]);
				arr.splice(index, 1);
			}
		},
		//加载保存的数据
		load : function(){
			var data;
			var json = localStorage.getItem(CACHE_KEY);
			var state;
			try{
				data = JSON.parse(json);
			}catch(e){}
			if($.isPlainObject(data)){
				this.set(data.model);
				state = this.get('state');
				if(state === 'ready'){
					this.set('state', 'prepare');
				}
				delete data.model;
				lotterys.prepared = data.prepared;
				lotterys.picked = data.picked;
				lotterys.winning = data.winning;
				$.each(data, function(name, arr){
					console.log(name, JSON.stringify(arr));
				});
			}
		},
		//保存当前的数据
		save : function(){
			lotterys.model = this.get();
			localStorage.setItem(
				CACHE_KEY,
				JSON.stringify(lotterys)
			);
		},
		//获取待抽奖彩票数量
		getPreparedCount : function(){
			return lotterys.prepared.length;
		},
		//检查场景状态
		checkState : function(){
			var state = this.get('state');
			if(state === 'rolling'){
				this.rolling();
			}else if(state === 'rolled'){
				this.stopRolling();
			}
			console.log('state:', state);
			this.save();
		},
		//摇奖
		rolling : function(){
			var that = this;
			var conf = this.conf;
			var prepared = lotterys.prepared;
			if(!prepared.length){
				this.set('state', 'ready');
				return;
			}
			if(!this.rollingTimer && prepared.length){
				$channel.trigger('rolling-start');
				this.rollingTimer = setInterval(function(){
					var item = prepared.pop();
					prepared.unshift(item);
					$channel.trigger('rolling', $.extend(true, {}, item));
				}, conf.rollingInterval);
			}
		},
		//停止摇奖
		stopRolling : function(){
			if(this.rollingTimer){
				clearInterval(this.rollingTimer);
				this.rollingTimer = null;
				$channel.trigger('rolling-stop');
			}
		},
		//抽取待选彩票
		pickLottery : function(count){
			var prepared = lotterys.prepared;
			var picked = lotterys.picked;
			var i;
			var lottery;
			if(!prepared.length){
				this.set('state', 'ready');
				return;
			}
			if(!picked.length){
				//仅在未选中彩票时挑选彩票
				for(i = 0; i < count; i++){
					lottery = prepared.pop();
					if(lottery){
						picked.push(lottery);
					}
				}
			}
			this.save();
		},
		//挑选中奖的彩票
		selectWinning : function(){
			var picked = lotterys.picked;
			var winning = lotterys.winning;
			var temp = [];
			var item = null;
			var time = Date.now();
			while(picked.length){
				item = picked.pop();
				if(item.checked){
					winning.push(item);
					item.time = time;
				}else{
					temp.push(item);
				}
			}
			while(temp.length){
				picked.push(temp.pop());
			}
			$channel.trigger('decided');
			this.save();
		},
		//清除选中的彩票，使其回到预备队列
		cleanPicked : function(){
			var picked = lotterys.picked;
			var prepared = lotterys.prepared;
			while(picked.length){
				prepared.push(picked.pop());
			}
			this.sortPreparedData();
			this.save();
		},
		//获取待抽奖彩票队列或者数据
		getPrepared : function(copy){
			return copy ? lotterys.prepared.slice(0) : lotterys.prepared;
		},
		//获取选中奖票队列或者数据
		getPicked : function(copy){
			return copy ? lotterys.picked.slice(0) : lotterys.picked;
		},
		//获取中奖奖票队列或者数据
		getWinning : function(copy){
			return copy ? lotterys.winning.slice(0) : lotterys.winning;
		}
	});

	module.exports = new LotteryBox();

});

