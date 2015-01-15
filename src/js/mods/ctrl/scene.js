/**
 * @fileoverview 场景动画
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/ctrl/scene',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $view = require('lib/mvc/view');
	var $controller = require('lib/mvc/controller');
	var $sceneModel = require('mods/model/scene');
	var $lotteryModel = require('mods/model/lotteryBox');
	var $sceneView = require('mods/view/scene');
	var $pickedBoxModel = require('mods/model/pickedBox');
	var $pickedBox = require('mods/view/pickedBox');

	var Scene = $controller.extend({
		defaults : {},
		build : function(){
			var conf = this.conf;
		},
		setEvents : function(){
			var doc = $(document);
			var proxy = this.proxy();
			doc.on('keydown', proxy('handleKeydown'));
			doc.on('click', proxy('handleClick'));
		},
		handleKeydown : function(evt){
			var ctrl = evt.ctrlKey;
			var alt = evt.altKey;
			var keyCode = evt.keyCode.toString();
			if(keyCode === '13'){
				this.toggle();
			}
		},
		handleClick : function(evt){
			var state = $lotteryModel.get('state');
			var clickEnableStates = [
				'prepare',
				'ready',
				'rolling'
			];
			if(evt.button === 0 && clickEnableStates.indexOf(state) >= 0){
				this.toggle();
			}
		},
		//切换场景状态
		toggle : function(){
			var state = $lotteryModel.get('state');
			var shuffling = $pickedBoxModel.get('shuffling');
			var celebrating = $pickedBoxModel.get('celebrating');
			var depressing = $pickedBoxModel.get('depressing');
			var putbacking = $pickedBoxModel.get('putbacking');

			if(state === 'prepare'){
				state = 'ready';
			}else if(
				state === 'ready' &&
				!shuffling && !celebrating &&
				!depressing && !putbacking
			){
				state = 'rolling';
			}else if(state === 'rolling'){
				state = 'rolled';
			}
			$lotteryModel.set('state', state);
		}
	});


	//下面的函数供在控制台调用。
	//江南赋的LED显示屏不能显示电脑的全屏界面，仅能显示左上角一小部分区域。
	//在控制台调用下面的方法，控制界面仅在左上角部分区域按比例缩放显示。
	var screenScene = $('#screen');
	window.setScale = function(num){
		num = parseFloat(num, 10);
		num = $limit(num, 0, 1);
		if(!num && num !== 0){
			num = localStorage.getItem('screenscale');
			if(!num){
				num = 0;
			}
		}else{
			localStorage.setItem('screenscale', num);
		}

		var x = 0;
		var y = 0;
		if(num <= 0){
			//为0则按默认方式显示
			screenScene.removeClass('scene-area');
			screenScene.transform({
				'scale' : 1,
				'translateX' : 0,
				'translateY' : 0
			});
		}else{
			//否则按区块显示
			screenScene.addClass('scene-area');
			x = ((1024 - 1024 * num) / 2) / num;
			y = ((768 - 768 * num) / 2) / num;

			screenScene.transform({
				'scale' : num,
				'translateX' : 0 - x + 'px',
				'translateY' : 0 - y + 'px'
			});
		}
	};
	setScale();

	$(window).on('resize', function(){
		var width = window.innerWidth;
		if(width >= 1024){
			setScale(0);
		}else{
			setScale(width / 1024);
		}
	});

	module.exports = new Scene();

});
