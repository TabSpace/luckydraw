/**
 * @fileoverview jquery lib 混合文件 
 * @authors liangdong2 
 */
define('lib/core/chaos/jquery',function(require,exports,module){

	var jQuery = require('lib/core/jquery/jquery');

	//jquery plugin
	require('lib/core/extra/jquery/prefixfree');
	require('lib/core/extra/jquery/transform');
	require('lib/core/extra/jquery/jquery');
	require('lib/core/extra/jquery/transit');

	module.exports = jQuery;

});
