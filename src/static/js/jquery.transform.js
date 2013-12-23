(function(){


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

})();