(function(){


	var conf = {};

	var defaults = {

	};

	var box = $('#box');
	var scene = $('#scene');
	conf = $.extend({}, defaults, conf);

	var data = [];

	for(var i = 0; i < 200; i++){
		data.push(i);
	}

	var html = [];
	data.forEach(function(text){
		html.push('<div class="item"><div class="text">' + text + '</div></div>');
	});
	scene.html(html.join(''));

	
	var sceneLimitRange = 100;
	var sceneWidth = 400;

	var getRandomDistance = function(){
		var distance = sceneWidth / 2 - Math.random() * sceneWidth;
		distance = distance >= 0 ? distance + sceneLimitRange : distance - sceneLimitRange;
		return distance;
	};

	$('.item').each(function(){
		var itemEl = $(this);
		var childEl = itemEl.find('.text');

		var x = getRandomDistance();
		var y = getRandomDistance();
		var z = getRandomDistance();

		var rx = 360 * Math.random();
		var ry = 360 * Math.random();
		var rz = 360 * Math.random();

		var r = Math.floor(100 + 155 * Math.random());
		var g = Math.floor(100 + 155 * Math.random());
		var b = Math.floor(100 + 155 * Math.random());

		itemEl.transform({
			'rotateX' : rx + 'deg',
			'rotateY' : ry + 'deg',
			'rotateZ' : rz + 'deg',
			'translateX' : x + 'px',
			'translateY' : y + 'px',
			'translateZ' : z + 'px'
		});
		childEl.css({
			'background' : 'rgba(' + r + ',' + g + ',' + b +',0.7)'
		});
	});


})();