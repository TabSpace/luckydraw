/**
 * @fileoverview 被选中彩票
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/model/pickedLottery',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var PickedLottery = $model.extend({
		defaults : {
			x : 0,
			y : 0,
			posX : 0,
			posY : 0,
			fullWidth : 512,
			width : 0,
			contW : 0,
			contH : 0,
			inplace : false,
			enter : false,
			hover : false,
			shuffled : false,
			checked : false,
			flipover : false,
			id : null
		},
		events : {
			'change:enter' : 'checkHover',
			'change:checked' : 'checkFlipOver',
			'change:shuffled' : 'checkFlipOver'
		},
		build : function(){
			var that = this;
			this.setComputed('scale', function(){
				return that.get('width') / that.get('fullWidth');
			});
			this.setComputed('deltaX', function(){
				var scale = that.get('scale');
				var deltaX = that.get('x') - that.get('contW') / 2;
				return deltaX / scale;
			});
			this.setComputed('deltaY', function(){
				var scale = that.get('scale');
				var deltaY = that.get('y') - that.get('contH') / 2;
				return deltaY / scale;
			});
		},
		checkHover : function(){
			var hover = false;
			if(this.get('inplace')){
				hover = this.get('enter');
			}
			this.set('hover', hover);
		},
		checkFlipOver : function(){
			var checked = this.get('checked');
			var shuffled = this.get('shuffled');
			this.set('flipover', checked && shuffled);
		},
		reset : function(){
			this.set(this.defaults);
		}
	});

	module.exports = PickedLottery;

});

