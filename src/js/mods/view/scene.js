/**
 * @fileoverview 动画场景
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/scene',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $delay = require('lib/kit/func/delay');
	var $lotteryModel = require('mods/model/lotteryBox');
	var $floatLottery = require('mods/view/floatLottery');
	var $sceneModel = require('mods/model/scene');
	var $channel = require('mods/channel/global');
	var $pickedBoxModel = require('mods/model/pickedBox');

	//模板
	var TPL = {
		//奖票
		item : [
			'<li class="item center">',
				'<div data-role="float-box" class="surface-box">',
					'<div data-role="float-outer" class="surface-outer">',
						'<div data-role="float-surface" class="surface">',
							'<div data-role="float-front" class="front"></div>',
							'<div data-role="float-back" class="back"></div>',
						'</div>',
					'</div>',
				'</div>',
			'</li>'
		].join('')
	};

	var Scene = $view.extend({
		defaults : {
			//漂浮彩票的最大数量
			floatItems : 88,
			//场景中彩票距离中心的最小距离
			distanceToCenter : 250,
			//场景宽度
			sceneWidth : 400
		},
		build : function(){
			this.root = this.role('root');
			this.bg = $('#scene-bg');
			//可操作彩票对象队列
			this.items = [];
			//在场景中显示的彩票队列
			this.queue = [];
			//要操作的彩票数据
			this.data = [];

			this.compute();
			this.render();
			this.checkState();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$lotteryModel.on('change:state', proxy('checkState'));
			$pickedBoxModel.on('change', proxy('checkState'));
			$channel.on('rolling-start', proxy('rotateScene'));
			$channel.on('rolling', proxy('erupt'));
			$channel.on('rolling-stop', proxy('shrink'));
		},
		checkState : function(){
			var that = this;
			var state = $lotteryModel.get('state');
			if(state === 'prepare'){
				this.showBg();
			}else{
				this.hideBg();
			}

			var shuffling = $pickedBoxModel.get('shuffling');
			var celebrating = $pickedBoxModel.get('celebrating');
			var depressing = $pickedBoxModel.get('depressing');
			var putbacking = $pickedBoxModel.get('putbacking');
			var animating = shuffling || celebrating || depressing || putbacking;

			clearTimeout(this.prepareTimer);
			if(state === 'ready' && !animating){
				this.prepareTimer = setTimeout(function(){
					if($lotteryModel.get('state') === 'ready'){
						$lotteryModel.set('state', 'prepare');
					}
				},  2000);
			}
		},
		showBg : function(){
			var state = $lotteryModel.get('state');
			if(state === 'prepare'){
				this.bg.removeClass('close');
			}
		},
		hideBg : function(){
			var state = $lotteryModel.get('state');
			if(state !== 'prepare'){
				this.bg.addClass('close');
			}
		},
		//计算环境数据
		compute : function(){
			var count = $lotteryModel.getPreparedCount();
			//实际漂浮彩票的数量不能超过总彩票数量
			this.floatItems = Math.min(this.conf.floatItems, count);
		},
		//准备环境界面
		render : function(){
			var conf = this.conf;
			var html = [];
			var items = this.items;
			var scene = this.role('scene-box');

			//总的彩票DOM元素数量应该要超过漂浮数量，以形成队列
			var maxItems = this.floatItems + 1000 / $lotteryModel.get('rollingInterval');

			//预先构建HTML
			for(var i = 0; i < maxItems; i++){
				html.push(TPL.item);
			}
			scene.html(html.join(''));

			//构建彩票对象队列
			scene.find('.item').each(function(){
				var item = new $floatLottery({
					distanceToCenter : conf.distanceToCenter,
					sceneWidth : conf.sceneWidth,
					node : $(this)
				});
				items.push(item);
			});
		},
		//旋转场景
		rotateScene : function(){
			this.compute();
			$sceneModel.set('rolling', true);
			this.role('scene-outer').css('animation', 'rotate-x linear ' + $sceneModel.get('speedX') + 's infinite');
			this.role('scene-inner').css('animation', 'rotate-y linear ' + $sceneModel.get('speedY') + 's infinite');
			this.role('scene-box').css('animation', 'rotate-z linear ' + $sceneModel.get('speedZ') + 's infinite');
		},
		//喷发彩票
		erupt : function(dataIn){
			if(!$sceneModel.get('rolling')){
				this.rotateScene();
			}
			var conf = this.conf;
			var items = this.items;
			var queue = this.queue;
			var item = items.pop();

			if(item){
				item.reset();
				item.setData(dataIn);
				dataIn.item = item;
				queue.push(dataIn);
				item.floatOut();
			}

			if(queue.length > this.floatItems){
				var dataOut = queue.shift();
				item = dataOut.item;
				items.unshift(item);
				item.floatIn();
				delete dataOut.item;
			}
		},
		//场景收缩
		shrink : function(){
			var that = this;
			var queue = this.queue;
			var items = this.items;

			if(!queue.length){
				return;
			}

			//以最快速度将所有漂浮彩票放回奖箱
			var timer = setInterval(function(){
				var item, dataOut;
				if(queue.length){
					dataOut = queue.shift();
					item = dataOut.item;
					items.unshift(item);
					item.floatIn();
					delete dataOut.item;
				}else{
					clearInterval(timer);
					timer = null;
					setTimeout(function(){
						$sceneModel.set('rolling', false);
						that.role('scene-outer').css('animation', '');
						that.role('scene-inner').css('animation', '');
						that.role('scene-box').css('animation', '');
					}, 1200);
				}
			}, 1);
		}
	});

	module.exports = new Scene({
		node : '#luckydraw-box'
	});

});