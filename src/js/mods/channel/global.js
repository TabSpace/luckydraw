/**
 * @fileoverview 全局广播
 * @authors liangdong2 
 */
define('mods/channel/global',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//显示提示信息
		'tip',
		//重置抽奖数据
		'reset',
		//选定当前彩票
		'pick-ok',
		//决定中奖彩票
		'decide',
		//中奖彩票已经决定完成
		'decided',
		//摇奖开始
		'rolling-start',
		//摇奖
		'rolling',
		//摇奖停止
		'rolling-stop',
		//清除选中彩票
		'clean-picked',
		//挑选的彩票发生了翻转
		'lottery-turn',
		//切换中奖列表
		'toggle-winning-list',
		//开始音乐
		'toggle-music'
	]);
});
