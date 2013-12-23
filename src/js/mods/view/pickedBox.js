/**
 * @fileoverview 被选中彩票所在的盒子
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/pickedBox',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $view = require('lib/mvc/view');
	var $pickedLottery = require('mods/view/pickedLottery');
	var $sceneModel = require('mods/model/scene');
	var $lotteryModel = require('mods/model/lotteryBox');
	var $configModel = require('mods/model/config');
	var $pickedBoxModel = require('mods/model/pickedBox');
	var $channel = require('mods/channel/global');

	var TPL = {
		item : [
			'<div class="ticket center">',
				'<div data-role="shadow" class="surface-shadow" style="opacity:0;">',
					'<div class="surface-shadow-outer">',
						'<div class="surface-shadow-inner"></div>',
					'</div>',
				'</div>',
				'<div data-role="box" class="surface-box">',
					'<div data-role="outer" class="surface-outer">',
						'<div data-role="surface" class="surface">',
							'<div data-role="front" class="front"></div>',
							'<div data-role="back" class="back"></div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'
		].join('')
	};

	//被挑中彩票所在的盒子
	var PickedBox = $view.extend({
		defaults : {
			//每行多少张
			row : 4,
			//每列多少张
			col : 4,
			//卡片Y位置偏移
			posYdelta : -38,
			//DOM元素
			node : '#ticket-box'
		},
		build : function(){
			this.items = [];
			this.container = $('#ticket-box-bg');
			this.render();
			this.checkState();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$lotteryModel.on('change:state', proxy('checkState'));
			$sceneModel.on('change:rolling', proxy('checkState'));
			$pickedBoxModel.on('change:showBoxBg', proxy('checkBoxBg'));
			$channel.on('shuffle', proxy('shuffle'));
			$channel.on('pick-ok', proxy('pickOk'));
			$channel.on('decided', proxy('celebrate'));
			$channel.on('pick-cancel', proxy('putback'));
		},
		//构造被挑中彩票
		render : function(){
			var conf = this.conf;
			var root = this.role('root');
			var i;
			var items = this.items;
			var html = [];
			var maxTickets = conf.row * conf.col;
			for(i = 0; i < maxTickets; i++){
				html.push(TPL.item);
			}
			root.html(html.join(''));

			root.find('.ticket').each(function(){
				items.push(
					new $pickedLottery({
						node : this
					})
				);
			});
		},
		checkState : function(){
			var state = $lotteryModel.get('state');
			var rolling = $sceneModel.get('rolling');
			if(state === 'rolled'){
				this.pickLottery();
			}else if(state === 'picked' && !rolling){
				this.arrange();
			}
		},
		//选择待选择奖票
		pickLottery : function(){
			var conf = this.conf;
			$lotteryModel.pickLottery(conf.row * conf.col);
			$pickedBoxModel.set('shuffled', false);
			$lotteryModel.set('state', 'picked');
		},
		//获取位置列表
		getPosList : function(){
			var conf = this.conf;
			var container = this.container;
			var width = container.width();
			var height = container.height();
			var list = [];
			var posX = [];
			var posY = [];
			var i;
			var unitW = width / conf.row;
			var unitH = height / conf.col;
			for(i = 0; i < conf.row; i++){
				posX.push(unitW * i + unitW / 2);
			}
			for(i = 0; i < conf.col; i++){
				posY.push(unitH * i + unitH / 2 + conf.posYdelta);
			}
			posY.forEach(function(py){
				posX.forEach(function(px){
					list.push({
						x : px,
						y : py
					});
				});
			});
			return list;
		},
		//排列挑选出的奖票
		arrange : function(){
			var that = this;
			var picked = $lotteryModel.getPicked();
			var items = this.items;
			var posList = this.getPosList();
			var count = 0;

			if(!picked.length){
				$lotteryModel.set('state', 'ready');
				return;
			}

			$pickedBoxModel.set('shuffled', false);
			picked.forEach(function(lottery, index){
				var item = items[index];
				var pos = posList.shift();
				if(item){
					item.setData(lottery);
					item.setPos(pos);
					item.vm.on('change:inplace', function(){
						if(item.vm.get('inplace')){
							count ++;
							if(count === picked.length){
								that.finishArrange();
							}
						}
					});
					item.on('check', function(){
						that.checkToggle(item);
					});
				}
			});
			this.showItemsToFront();
		},
		//完成安排后的工作
		finishArrange : function(){
			$pickedBoxModel.set('showBoxBg', true);
			this.shuffle();
		},
		//获取添加了彩票数据的选中票
		getLotteryItems : function(){
			return this.items.slice(0).filter(function(item){
				return item.vm.get('id') !== null;
			});
		},
		//获取选中彩票队列
		getPickedItems : function(){
			var items = this.getLotteryItems();
			var picked = $lotteryModel.getPicked(true).map(function(item){
				return item.id;
			});
			return items.filter(function(item){
				var id = item.vm.get('id');
				if(picked.indexOf(id) >= 0){
					return true;
				}
			});
		},
		//获取得奖彩票队列
		getWinningItems : function(){
			var items = this.getLotteryItems();
			var winning = $lotteryModel.getWinning(true);
			winning = winning.map(function(item){
				return item.id;
			});
			return items.filter(function(item){
				var id = item.vm.get('id');
				if(winning.indexOf(id) >= 0){
					return true;
				}
			});
		},
		//检查是否可以切换卡片正反面
		checkToggle : function(item){
			var items = this.getLotteryItems();
			var checkedItems = items.filter(function(item){
				return item.vm.get('checked');
			});
			if(!$pickedBoxModel.get('shuffled')){return;}
			if(item.vm.get('checked')){
				item.toggle();
			}else{
				if(checkedItems.length < $configModel.get('drawCount')){
					item.toggle();
				}
			}
		},
		//将选中的票展示到前面来
		showItemsToFront : function(){
			var that = this;
			var queue = this.getLotteryItems();
			var timer = setInterval(function(){
				if(queue.length){
					queue.pop().checkState();
				}else{
					clearInterval(timer);
					timer = null;
				}
			}, 100);
		},
		//显示选中票的大背景
		checkBoxBg : function(){
			var visible = $pickedBoxModel.get('showBoxBg');
			var box = this.container;
			if(visible){
				box.show().transit({
					opacity : 1
				}, 500, 'linear');
			}else{
				box.show().transit({
					opacity : 0
				}, 500, 'linear', function(){
					if(!$pickedBoxModel.get('showBoxBg')){
						box.hide();
					}
				});
			}
		},
		//将挑选出的卡片洗牌
		shuffle : function(){
			var that = this;
			$pickedBoxModel.set('shuffled', false);

			if($pickedBoxModel.get('shuffling')){return;}
			$pickedBoxModel.set('shuffling', true);

			var count = 10;
			var items = this.getLotteryItems();
			var poses = items.map(function(item){
				return {
					x : item.vm.get('x'),
					y : item.vm.get('y')
				};
			});
			var timer = setInterval(function(){
				if(count > 0){
					count --;
					poses.sort(function(){
						return Math.random() - 0.5;
					}).forEach(function(pos, index){
						items[index].setPos(pos);
					});
				}else{
					clearInterval(timer);
					timer = null;
					items.forEach(function(item){
						item.vm.set('shuffled', true);
					});
					$pickedBoxModel.set('shuffling', false);
					$pickedBoxModel.set('shuffled', true);
				}
			}, 200);
		},
		//选定翻转的卡片
		pickOk : function(){
			console.log('pick-ok');
			var items = this.getLotteryItems();
			var checkedItems = items.filter(function(item){
				return item.vm.get('checked');
			});
			var decision = checkedItems.map(function(item){
				return item.vm.get('id');
			});
			if(!decision.length){return;}
			$channel.trigger('decide', decision);

			//还原被选中的彩票，使其回到待选队列
			$channel.trigger('clean-picked');
		},
		//选中的彩票进行庆祝
		celebrate : function(){
			console.log('celebrate');
			var that = this;
			var winningItems = this.getWinningItems();
			var step = 0;
			var count = winningItems.length;
			$pickedBoxModel.set('showBoxBg', false);
			winningItems.sort(function(){
				return Math.random() - 0.5;
			});
			$pickedBoxModel.set('celebrating', true);
			var timer = setInterval(function(){
				if(winningItems.length){
					var item = winningItems.pop();
					item.on('celebrated', function(){
						step ++;
						if(step >= count){
							$pickedBoxModel.set('celebrating', false);
						}
					});
					item.celebrate();
				}else{
					clearInterval(timer);
					timer = null;
				}
			}, 200);

			//有选中的就有没选中的，没选中的就去沮丧一下吧
			this.depress();
			this.restoreSceneState();
		},
		//未选中的彩票表示遗憾
		depress : function(){
			var that = this;
			var pickedItems = this.getPickedItems();
			var step = 0;
			var count = pickedItems.length;
			pickedItems.sort(function(){
				return Math.random() - 0.5;
			});
			$pickedBoxModel.set('depressing', true);
			var timer = setInterval(function(){
				if(pickedItems.length){
					var item = pickedItems.pop();
					item.on('depressed', function(){
						step ++;
						if(step >= count){
							$pickedBoxModel.set('depressing', false);
						}
					});
					item.depress();
				}else{
					clearInterval(timer);
					timer = null;
				}
			}, 50);
		},
		//将选中彩票放回去
		putback : function(){
			var that = this;
			var pickedItems = this.getPickedItems();
			var step = 0;
			var count = pickedItems.length;
			pickedItems.sort(function(){
				return Math.random() - 0.5;
			});
			$pickedBoxModel.set('showBoxBg', false);
			$pickedBoxModel.set('putbacking', true);
			var timer = setInterval(function(){
				if(pickedItems.length){
					var item = pickedItems.pop();
					item.on('putbacked', function(){
						step ++;
						if(step >= count){
							$pickedBoxModel.set('putbacking', false);
						}
					});
					item.putBack();
				}else{
					clearInterval(timer);
					timer = null;
				}
			}, 50);

			//还原被选中的彩票，使其回到待选队列
			$channel.trigger('clean-picked');
			this.restoreSceneState();
		},
		//还原场景状态
		restoreSceneState : function(){
			$lotteryModel.set('state', 'ready');
		}
	});

	module.exports = new PickedBox();

});
