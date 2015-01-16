/**
 * @fileoverview 浮动的彩票
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/view/floatLottery',function(require,exports,module){

	var $ = require('lib');
	var $limit = require('lib/kit/num/limit');
	var $view = require('lib/mvc/view');
	var $model = require('lib/mvc/model');

	//漂浮的彩票
	var FloatLottery = $view.extend({
		defaults : {
			//场景中奖票距离中心的最小距离
			distanceToCenter : 200,
			//场景宽度
			sceneWidth : 400,
			//DOM元素
			node : null
		},
		build : function(){
			var conf = this.conf;
			this.vm = new $model();
			this.root = conf.node;
			this.root.hide();
			this.render();
		},
		//重置奖票数据
		reset : function(){
			this.vm.clear();
			this.render();
		},
		//设置奖票数据
		setData : function(data){
			this.vm.set(data);
			this.render();
		},
		//渲染奖票
		render : function(){
			var id = this.vm.get('id');
			var name = this.vm.get('name');
			var elFront = this.role('float-front');
			if(name && id){
				elFront.html('<p>' + name + '</p><p>' + id + '</p>');
			}else if(id){
				elFront.html(id);
			}else{
				elFront.html('');
			}
		},
		//获取距离中心的随机距离
		getRandomDistance : function(){
			var conf = this.conf;
			var distance = conf.sceneWidth / 2 - Math.random() * conf.sceneWidth;
			distance = distance >= 0 ? distance + conf.distanceToCenter : distance - conf.distanceToCenter;
			return distance;
		},
		//飘出奖盒
		floatOut : function(){
			var that = this;
			var elSurfaceBox = this.role('float-box');
			var elSurfaceOuter = this.role('float-outer');
			var elSurface = this.role('float-surface');

			var x = this.getRandomDistance();
			var y = this.getRandomDistance();
			var z = this.getRandomDistance();

			var rx = 360 * Math.random();
			var ry = 360 * Math.random();
			var rz = 360 * Math.random();

			var sx = Math.random() * 2 + 3;
			var sy = Math.random() * 2 + 3;
			var sz = Math.random() * 2 + 3;

			this.root.show().transit({
				'rotateX' : rx + 'deg',
				'rotateY' : ry + 'deg',
				'rotateZ' : rz + 'deg',
				'translateX' : x + 'px',
				'translateZ' : z + 'px'
			}, 1000, 'ease-in', function(){
				elSurface.css('animation', 'rotate-y linear ' + sy + 's infinite');
			}.bind(this));
		},
		//飘回奖盒
		floatIn : function(){
			var that = this;
			var elSurfaceBox = this.role('float-box');
			var elSurfaceOuter = this.role('float-outer');
			var elSurface = this.role('float-surface');
			this.root.transit({
				'rotateX' : 0,
				'rotateY' : 0,
				'rotateZ' : 0,
				'translateX' : 0,
				'translateZ' : 0
			}, 1000, 'ease-in');

			//这里的transitionEnd有可能被误触发
			//zepto的transitionEnd回调并不可靠，应当封装为一次性执行函数
			setTimeout(function(){
				elSurfaceBox.css('animation', '');
				elSurfaceOuter.css('animation', '');
				elSurface.css('animation', '');
				//隐藏返回的彩票有助于提升动画性能
				that.root.hide();
			}, 1000);
		}
	});

	module.exports = FloatLottery;

});
