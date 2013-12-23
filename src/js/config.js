define('config',function(require,exports,module){
	// test
	var config = {
		base:'src/js/',
		//it will replace the real BASEPATH
		//for debug or update timestamp ? All javascript modules will be used
		alias:{
			'lib':'lib/core/chaos/jquery'
		}
	};

	config.timestamp = + new Date();

	module.exports = config;
});
