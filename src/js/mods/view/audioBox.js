/**
 * @fileoverview 音频控制
 * @authors liangdong2  <pillar0514@gmail.com>
 */
define('mods/view/audioBox',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $lotteryModel = require('mods/model/lotteryBox');
	var $channel = require('mods/channel/global');

	var AudioBox = $view.extend({
		defaults : {
			node : '#audio-box'
		},
		build : function(){
			this.checkState();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var prev = this.role('prev');
			prev.on('ended', proxy('startLoop'));
			$lotteryModel.on('change:state', proxy('checkState'));
			$channel.on('toggle-music', proxy('toggle'));
		},
		checkState : function(){
			var state = $lotteryModel.get('state');
			if(state !== 'prepare'){
				this.start();
			}
		},
		toggle : function(){
			if(this.started){
				this.stop();
			}else{
				this.start();
			}
		},
		start : function(){
			if(this.started){return;}
			this.started = true;
			var prev = this.role('prev');
			prev.get(0).play();
		},
		stop : function(){
			var prev = this.role('prev');
			var loop = this.role('loop');
			prev.get(0).pause();
			loop.get(0).pause();
			this.started = false;
		},
		startLoop : function(){
			var loop = this.role('loop');
			loop.get(0).play();
		}
	});

	module.exports = new AudioBox();

});

