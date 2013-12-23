/**
 * @fileoverview 奖品UI
 * @authors liangdong2 <liangdong2@staff.sina.com.cn> <pillar0514@gmail.com>
 */
define('mods/view/prize',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $mustache = require('lib/more/mustache');
	var $channel = require('mods/channel/global');
	var $configModel = require('mods/model/config');
	var $prizeModel = require('mods/model/prize');

	var TPL = {
		prizeItem : [
			'{{#.}}',
				'<li data-id="{{id}}">',
					'<span>奖品名称：</span>',
					'<input name="prize-name" value="{{name}}"/>',
					'<button data-role="up">向上</button>',
					'<button data-role="down">向下</button>',
					'<button data-role="del-prize">删除</button>',
				'</li>',
			'{{/.}}',
		].join('')
	};

	var Prize = $view.extend({
		defaults : {
			node : '#config-panel [data-role="prize-box"]',
			events : {
				'[data-role="up"] click' : 'moveUp',
				'[data-role="down"] click' : 'moveDown',
				'[data-role="del-prize"] click' : 'delPrize'
			}
		},
		build : function(){
			this.root = this.role('root');
			this.elAdd = $('#config-panel [data-role="add-prize"]');
			this.elConfirm = $('#config-panel [data-role="save-prize"]');
			this.elPrizeName = $('#prize-name');
			this.elWinningCount = $('#winning-count');
			this.render();
			this.renderCurrent();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$prizeModel.on('change:list', proxy('render'));
			$prizeModel.on('save', proxy('renderCurrent'));
			this.elAdd.on('click', proxy('addPrize'));
			this.elConfirm.on('click', proxy('save'));
			$channel.on('switch-prize', proxy('switchPrize'));
			$configModel.on('change:currentPrize', proxy('renderCurrent'));
		},
		//渲染奖品列表
		render : function(){
			var data = $prizeModel.getList();
			var html = $mustache.render(TPL.prizeItem, data);
			this.root.html(html);
		},
		//渲染当前奖品数据
		renderCurrent : function(){
			var currentItem = $configModel.getCurrentPrize(true);
			if(currentItem){
				this.elPrizeName.html(currentItem.name);
				this.elWinningCount.html(currentItem.count);
			}else{
				this.elPrizeName.html('');
				this.elWinningCount.html('');
			}
		},
		addPrize : function(){
			$prizeModel.add();
		},
		getItemNode : function(evt){
			var el = $(evt.currentTarget);
			return el.parents('li');
		},
		moveUp : function(evt){
			var itemNode = this.getItemNode(evt);
			var id = itemNode.attr('data-id');
			$prizeModel.move(id, 'up');
		},
		moveDown : function(evt){
			var itemNode = this.getItemNode(evt);
			var id = itemNode.attr('data-id');
			$prizeModel.move(id, 'down');
		},
		delPrize : function(evt){
			var itemNode = this.getItemNode(evt);
			var id = itemNode.attr('data-id');
			$prizeModel.remove(id);
		},
		//保存奖品数据
		save : function(){
			var itemNodes = this.root.find('li');
			var data = {};
			itemNodes.each(function(){
				var el = $(this);
				var id = el.attr('data-id');
				var name = el.find('[name="prize-name"]').val();
				data[id] = name;
			});
			$prizeModel.update(data);
			$channel.trigger('tip', '奖品数据已保存');
		},
		//切换奖品
		switchPrize : function(dir){
			$configModel.switchPrize(dir);
		}
	});

	module.exports = new Prize();

});