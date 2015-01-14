/**
 * @fileoverview 被选中的彩票
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/pickedLottery',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $delay = require('lib/kit/func/delay');
	var $view = require('lib/mvc/view');
	var $model = require('lib/mvc/model');
	var $pickedBoxModel = require('mods/model/pickedBox');
	var $pickedLotteryModel = require('mods/model/pickedLottery');
	var $channel = require('mods/channel/global');

	//被挑中的彩票
	var PickedLottery = $view.extend({
		defaults : {
			width : 200,
			template : '',
			//DOM元素
			node : null,
			events : {
				'click' : 'onClick'
			}
		},
		build : function(){
			this.vm = new $pickedLotteryModel();
			this.container = $('#ticket-box-bg');
			this.compute();
			this.render();
			this.move = $delay(this.move, 10);
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var vm = this.vm;
			this.delegate(action);
			vm.on('change:x', proxy('move'));
			vm.on('change:y', proxy('move'));
			vm.on('change:checked', proxy('checkData'));
			vm.on('change:flipover', proxy('checkTurn'));
			$pickedBoxModel.on('change:showBoxBg', proxy('checkShadow'));
			$pickedBoxModel.on('change:shuffling', proxy('checkLetter'));
		},
		compute : function(){
			this.vm.set({
				fullWidth : this.role('root').width(),
				width : this.conf.width,
				contW : this.container.width(),
				contH : this.container.height()
			});
		},
		onClick : function(){
			this.trigger('check');
		},
		//切换正反面
		toggle : function(){
			var checked = this.vm.get('checked');
			this.vm.set('checked', !checked);
		},
		//检查切换状态，旋转卡片
		checkTurn : function(){
			var root = this.role('root');
			if(this.vm.get('flipover')){
				root.addClass('checked');
			}else{
				root.removeClass('checked');
			}
		},
		//渲染彩票数据
		render : function(){
			var id = this.vm.get('id');
			var elFront = this.role('front');
			if(id !== null){
				elFront.html(id);
			}else{
				elFront.html('');
			}
		},
		checkShadow : function(){
			var visible = $pickedBoxModel.get('showBoxBg');
			var elShadow = this.role('shadow');
			if(visible){
				elShadow.css('opacity', 1);
			}else{
				elShadow.css('opacity', 0);
			}
		},
		//检查彩票状态，展示彩票
		checkState : function(){
			var id = this.vm.get('id');
			if(id !== null){
				this.toFront();
			}
		},
		//检查数据同步
		checkData : function(){
			var checked = this.vm.get('checked');
			if(this.data){
				this.data.checked = checked;
			}
			$channel.trigger('lottery-turn');
		},
		//设置彩票数据
		setData : function(data){
			this.data = data;
			this.vm.set(data);
			this.render();
		},
		//设置彩票位置
		setPos : function(pos){
			this.vm.set(pos);
		},
		//检查显示和隐藏字母的时机
		checkLetter : function(){
			var shuffling = $pickedBoxModel.get('shuffling');
			if(shuffling){
				this.hideLetter();
			}else{
				this.showLetter();
			}
		},
		//显示字母
		showLetter : function(){
			var elBack = this.role('back');
			var posX = this.vm.get('x');
			var posY = this.vm.get('y');
			var row = 1;
			var col = 1;
			if(posX > 0 && posX < 240){
				row = 0;
			}else if(posX > 240 && posX < 480){
				row = 1;
			}else if(posX > 480 && posX < 720){
				row = 2;
			}else{
				row = 3;
			}

			if(posY > 0 && posY < 100){
				col = 0;
			}else if(posY > 100 && posY < 200){
				col = 1;
			}else if(posY > 200 && posY < 300){
				col = 2;
			}else{
				col = 3;
			}
			var pos = row + col * 4;
			var arr = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');
			var letter = arr[pos];
			elBack.html(letter);
		},
		//隐藏字母
		hideLetter : function(){
			var elBack = this.role('back');
			elBack.html('');
		},
		//到前面来
		toFront : function(){
			var that = this;
			var root = this.role('root');
			//计算位置前需要先显示卡片并计算卡片参数
			root.show();
			this.compute();

			var vm = this.vm;
			var scale = vm.get('scale');
			var x = vm.get('deltaX');
			var y = vm.get('deltaY');

			this.render();
			root.transform({
				'translateZ' : '-149px',
				'scale' : 0.72
			}).transit({
				'translateY' : '-300px',
				'translateZ' : '-149px',
				'scale' : 0.72
			}, 500, 'ease-out', function(){
				root.transit({
					'scale' : scale,
					'translateX' : x + 'px',
					'translateY' : y + 'px'
				}, 500, 'ease-in', function(){
					that.vm.set('inplace', true);
				});
			});
		},
		//移动彩票到目标位置
		move : function(){
			var vm = this.vm;
			var root = this.role('root');
			var scale = vm.get('scale');
			var x = vm.get('deltaX');
			var y = vm.get('deltaY');
			if(vm.get('inplace')){
				root.transit({
					'scale' : scale,
					'translateX' : x + 'px',
					'translateY' : y + 'px'
				}, 150, 'ease-in');
			}
		},
		//庆祝动作
		celebrate : function(){
			var that = this;
			var vm = this.vm;
			var root = this.role('root');
			var scale = vm.get('scale');
			var x = vm.get('deltaX');
			var y = vm.get('deltaY');
			var elOuter = this.role('outer');
			root.transit({
				'scale' : scale,
				'translateX' : 2000 + 'px',
				'translateY' : y + 'px'
			}, 500, 'ease-in', function(){
				that.trigger('celebrated');
				that.clean();
			});
		},
		//表示沮丧
		depress : function(){
			var that = this;
			var vm = this.vm;
			var root = this.role('root');
			var scale = vm.get('scale');
			var x = vm.get('deltaX');
			var y = vm.get('deltaY');
			var elOuter = this.role('outer');
			setTimeout(function(){
				elOuter.transit('depressed', {
					duration : 4000,
					complete : function(){
						setTimeout(function(){
							that.backToList(function(){
								that.trigger('depressed');
							});
						}, 500);
					}
				});
			}, 2000);
		},
		//把彩票放回去列表
		putBack : function(){
			var that = this;
			this.vm.set('checked', false);
			setTimeout(function(){
				that.backToList(function(){
					that.trigger('putbacked');
				});
			}, 500);
		},
		//返回列表
		backToList : function(callback){
			var that = this;
			var vm = this.vm;
			var root = this.role('root');
			var scale = vm.get('scale');
			var x = vm.get('deltaX');
			var y = vm.get('deltaY');
			root.transit({
				'translateX' : x + 'px',
				'translateY' : y + 'px',
				'translateZ' : '-151px',
				'scale' : 0.72
			}, 500, 'ease-out', function(){
				root.transit({
					'translateX' : 0,
					'translateY' : 0,
					'translateZ' : '-151px',
					'scale' : 0.72
				}, 500, 'ease-out', function(){
					if($.isFunction(callback)){
						callback();
						that.clean();
					}
				});
			});
		},
		//清除自身的数据与状态
		clean : function(){
			var root = this.role('root');
			//重置模型时解绑事件避免影响UI操作
			this.setEvents('off');
			this.vm.reset();
			this.checkData();
			this.setEvents('on');

			//解绑模型自己的事件
			this.off();

			//恢复UI状态
			this.role('back').html('');
			this.role('front').html('');
			this.role('surface').css('transform', '');
			this.role('outer').css('transform', '');
			root.css('transform', '').hide();
		}
	});

	module.exports = PickedLottery;

});
