/**
 * @fileoverview 年会抽奖程序
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         中得大奖
//


(function(){

	var limit = function(num, min, max){
		return Math.min( Math.max(num, min), max );
	};

	//模板
	var TPL = {
		//奖票
		item : [
			'<li class="item">',
				'<div class="front"></div>',
				'<div class="back"></div>',
			'</li>'
		].join('')
	};

	//漂浮奖票
	var LuckyItem = {
		defaults : {
			//场景中奖票距离中心的最小距离
			distanceToCenter : 200,
			//场景宽度
			sceneWidth : 400,
			//DOM元素
			node : null
		},
		init : function(options){
			var conf = this.conf = $.extend({},this.defaults,options);
			this.root = conf.node;
			this.elFront = this.root.find('.front');
			this.elBack = this.root.find('.back');
		},
		//重置奖票数据
		reset : function(){
			this.data = {};
			this.render();
		},
		//设置奖票数据
		setData : function(data){
			this.data = $.extend(true, {}, data);
			this.render();
		},
		//渲染奖票
		render : function(){
			var data = this.data;
			var strId = data.id || '';
			var thumb = data.thumb || '';
			var elFront = this.elFront;
			var elBack = this.elBack;
			elFront.html(strId);
			if(thumb){
				elFront.css({
					'background-image' : data.thumb
				});
			}

			var r = Math.floor(100 + 155 * Math.random());
			var g = Math.floor(100 + 155 * Math.random());
			var b = Math.floor(100 + 155 * Math.random());
			elFront.css({
				'background-color' : 'rgba(' + r + ',' + g + ',' + b +',0.7)',
			});
			elBack.css({
				'background-color' : 'rgba(' + r + ',' + g + ',' + b +',0.7)'
			});
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
			var x = this.getRandomDistance();
			var y = this.getRandomDistance();
			var z = this.getRandomDistance();

			var rx = 360 * Math.random();
			var ry = 360 * Math.random();
			var rz = 360 * Math.random();

			this.root.transit({
				'rotateX' : rx + 'deg',
				'rotateY' : ry + 'deg',
				'rotateZ' : rz + 'deg',
				'translateX' : x + 'px',
				'translateZ' : z + 'px'
			}, 1000, 'ease-in', function(){

			}.bind(this));
		},
		//飘回奖盒
		floatIn : function(){
			this.root.transit({
				'rotateX' : 0,
				'rotateY' : 0,
				'rotateZ' : 0,
				'translateX' : 0,
				'translateZ' : 0
			}, 1000, 'ease-in');
		}
	};

	var itemDemo = Object.create(LuckyItem);
	itemDemo.init({
		node : $('#item-demo')
	});
	itemDemo.setData({
		id : '023'
	});

	var speed = {
		x : 20,
		y : 20,
		z : 20
	};

	var realSpeed = {
		x : 20,
		y : 20,
		z : 20
	};

	//抽奖流程
	var LuckyDraw = {
		defaults : {
			//奖票数据
			data : [],
			//漂浮奖票的最大数量
			floatItems : 200,
			//场景中奖票距离中心的最小距离
			distanceToCenter : 200,
			//场景宽度
			sceneWidth : 400,
			//喷发间隔时间
			eruptionInterval : 50
		},
		init : function(options){
			var conf = this.conf = $.extend({},this.defaults,options);
			//最外层容器
			this.box = $('#box');
			//场景元素
			this.scene = $('#scene');
			this.elOuter = this.box.find('.outer');
			this.elInner = this.box.find('.inner');
			this.elTicket = this.box.find('.ticket');
			//状态标记
			this.state = 'ready';
			//ID数据
			this.data = conf.data;
			//在场景中显示的奖票队列
			this.queue = [];
			//奖票对象队列
			this.items = [];
			if(!this.data.length){return;}
			this.compute();
			this.build();
		},
		//计算环境数据
		compute : function(){
			//实际漂浮奖票的最大数量不能超过总奖票数量
			this.floatItems = Math.min(this.conf.floatItems, this.data.length - 1);
		},
		//构建场景元素
		build : function(){
			var conf = this.conf;
			var html = [];
			var items = this.items;
			//总的奖票DOM元素数量应该要超过漂浮数量，以形成队列
			var maxItems = this.floatItems + 1000 / conf.eruptionInterval;

			//预先构建HTML
			for(var i = 0; i < maxItems; i++){
				html.push(TPL.item);
			}
			this.scene.html(html.join(''));

			//构建奖票对象队列
			this.scene.find('.item').each(function(){
				var item = Object.create(LuckyItem);
				item.init({
					distanceToCenter : conf.distanceToCenter,
					sceneWidth : conf.sceneWidth,
					node : $(this)
				});
				items.push(item);
			});
		},
		//开始摇奖
		start : function(){
			if(this.data.length > 0){
				console.log('rolling');
				this.state = 'rolling';
				this.startEruption();
			}
		},
		//抽奖
		draw : function(){
			console.log('drawing');
			this.state = 'drawing';
			this.stopEruption();
		},
		//开始喷发
		startEruption : function(){
			var conf = this.conf;
			var queue = this.queue;
			var items = this.items;
			var data = this.data;
			if(!this.timer){
				this.elOuter.css('animation', 'rotate-x linear ' + realSpeed.x + 's infinite');
				this.elInner.css('animation', 'rotate-y linear ' + realSpeed.y + 's infinite');
				this.scene.css('animation', 'rotate-z linear ' + realSpeed.z + 's infinite');
				//定时发射奖票到外部
				this.timer = setInterval(function(){
					if(data.length > 0){
						//抽出数据与奖票对象，配对后发射
						var dataIn = data.pop();
						var item = items.pop();
						item.reset();
						item.setData(dataIn);
						dataIn.item = item;
						queue.push(dataIn);
						item.floatOut();

						if(queue.length > this.floatItems){
							var dataOut = queue.shift();
							item = dataOut.item;
							items.unshift(item);
							data.unshift(dataOut);
							item.floatIn();
							dataOut.item = null;
						}
					}
				}.bind(this), conf.eruptionInterval);
			}
		},
		//停止喷发
		stopEruption : function(){
			var queue = this.queue;
			var items = this.items;
			var data = this.data;
			if(this.timer){
				clearInterval(this.timer);
				this.timer = null;

				//以最快速度将所有漂浮奖票放回奖箱
				var timer = setInterval(function(){
					var item, dataOut;
					if(queue.length){
						dataOut = queue.shift();
						item = dataOut.item;
						items.unshift(item);
						data.unshift(dataOut);
						item.floatIn();
						dataOut.item = null;
					}else{
						clearInterval(timer);
						setTimeout(function(){
							this.elOuter.css('animation', '');
							this.elInner.css('animation', '');
							this.scene.css('animation', '');
							this.getTicket();
						}.bind(this), 1200);
					}
				}.bind(this), 1);
			}
		},
		//获取奖票
		getTicket : function(){
			var data = this.data;
			var index = Math.floor(Math.random() * data.length);
			console.log('getTicket:', data.length, index);
			var ticketData = $.extend(true, {}, data[index]);
			data.splice(index, 1);
			this.compute();
			this.showTicket(ticketData);
		},
		//展示奖票
		showTicket : function(ticketData){
			var that = this;
			console.log('showTicket:',ticketData);
			var node = this.elTicket;
			var front = node.find('.front');
			var content = node.find('.content');
			front.html(ticketData.id);
			content.transform({
				'rotateY' : '180deg'
			});
			node.transit({
				'translateX' : 0,
				'translateY' : -2000 + 'px',
				'translateZ' : -5000 + 'px'
			}, 500, 'ease-out', function(){
				node.transit({
					'translateX' : 0,
					'translateY' : 0,
					'translateZ' : 0
				}, 500, 'ease-in', function(){
					content.transit({
						'rotateY' : 0
					}, 500, 'ease-in', function(){
						that.state = 'drawed';
						console.log('drawed');
					});
				});
			});
		},
		//重置奖票状态
		reset : function(){
			var node = this.elTicket;
			node.transit({
				'translateX' : 2000 + 'px',
				'translateY' : 0,
				'translateZ' : 0
			}, 500, 'ease-out', function(){
				node.transform({
					'translateX' : 0,
					'translateY' : 0,
					'translateZ' : -5000 + 'px'
				});
				this.state = 'ready';
				console.log('ready');
			}.bind(this));
		}
	};

	$(function(){

		var data = [];
		for(var i=0; i<300; i++){
			data.push({
				name : '名字',
				id : i
			});
		}

		var luckydraw = Object.create(LuckyDraw);
		luckydraw.init({
			//奖票数据
			data : data,
			//漂浮奖票的最大数量
			floatItems : 100,
			//场景中奖票距离中心的最小距离
			distanceToCenter : 150,
			//场景宽度
			sceneWidth : 400,
			//喷发间隔时间
			eruptionInterval : 60
		});

		var setSpeed = function(){
			$.each(speed, function(name, val){
				realSpeed[name] = val + val * 0.2 - Math.random() * val * 0.4;
			});
			var html = [
				'<li>说明：数字越大越慢，奖票飞出时才生效</li>',
				'<li>rotate.x:' + realSpeed.x + '</li>',
				'<li>rotate.y:' + realSpeed.y + '</li>',
				'<li>rotate.z:' + realSpeed.z + '</li>',
				'<li>回车启动摇奖</li>'
			].join('');
			$('#speed').html(html);
		};

		var handle = function(evt){
			if(!evt){return;}
			var state = luckydraw.state;
			var keyCode = evt.keyCode.toString();
			if(keyCode === '13'){
				if(state === 'ready'){
					luckydraw.start();
				}else if(state === 'rolling'){
					luckydraw.draw();
				}else if(state === 'drawed'){
					luckydraw.reset();
				}
			}
			console.log(evt.keyCode);
			if(keyCode === '38'){
				speed.x = Math.min(50, speed.x + 1);
				speed.y = Math.min(50, speed.y + 1);
				speed.z = Math.min(50, speed.z + 1);
				setSpeed();
			}
			if(keyCode === '40'){
				speed.x = Math.max(1, speed.x - 1);
				speed.y = Math.max(1, speed.y - 1);
				speed.z = Math.max(1, speed.z - 1);
				setSpeed();
			}
		};

		setSpeed();
		$(document).on('keydown', handle);
	});

})();

