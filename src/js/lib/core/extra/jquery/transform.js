/**
 * @fileoverview jquery transform属性获取与设置 
 * @authors liangdong2 
 * @param {String} property 要设置的 transform 属性
 * @param {Object} property transform 键值对
 * @param {String} value 要设置的 transform 值
 * @returns transform属性值， transform字符串，或者undefined
 * @example
	$('div').transform('translateX', '20px');
	$('div').transform({
		'translateX' : '20px'
	});
	$('div').transform();	//'translateX(20px)'
	$('div').transform('translateX');	//'20px'
 */
define('lib/core/extra/jquery/transform',function(require,exports,module){

	var $ = require('lib/core/jquery/jquery');

	$.fn.transform = function(property, value){
		var obj = {};

		var transform = $.style($(this)[0], 'transform') || '';
		transform = transform === 'none' ? '' : transform;
		transform = transform.replace(/,\s+/gi, ',');

		transform.split(/([^,])\s+/gi).forEach(function(str, index){
			if(!str){return;}
			if(!str.match(/\w+/)){return;}
			var name = str.match(/\w+/)[0];
			var val = str.replace(name, '').replace(/[\(\)]/gi,'');
			val = $.trim(val);
			obj[name] = val;
		});

		if(!property){
			return obj;
		}

		if(typeof property === 'string'){
			if($.type(value) === 'undefined'){
				return obj[property] || 0;
			}else{
				obj[property] = value;
			}
		}else{
			$.extend(obj, property);
		}

		transform = [];
		$.each(obj, function(key, val){
			var str = key + '(' + val + ')';
			transform.push(str);
		});

		if(transform.length){
			transform = transform.join(' ');
		}else{
			transform = '';
		}

		return $(this).css('transform', transform);
	};

});



