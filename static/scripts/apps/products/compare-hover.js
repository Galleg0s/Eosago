var $ = require('jquery');

module.exports = function($product, $fixedTitle) {
	'use strict';

	$product.hover(function() {
		var index = $(this).index();

		$fixedTitle.eq(index).toggleClass('hovered');
	});

	$fixedTitle.hover(function() {
		var index = $(this).index();

		if (index === 0) {
			return;
		}

		$product.eq(index).toggleClass('hovered');
	});
};
