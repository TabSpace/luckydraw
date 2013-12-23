/**
 * @fileoverview jquery插件 - 提供免前缀设置CSS3功能 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('lib/core/extra/jquery/prefixfree',function(require,exports,module){

	var $ = require('lib/core/jquery/jquery');

	(function($, self){

		if(!$ || !self) {
			return;
		}

		for(var i=0; i<self.properties.length; i++) {
			var property = self.properties[i],
				camelCased = StyleFix.camelCase(property),
				PrefixCamelCased = self.prefixProperty(property, true);
			$.cssProps[camelCased] = PrefixCamelCased;
		}

	})($, window.PrefixFree);

});

