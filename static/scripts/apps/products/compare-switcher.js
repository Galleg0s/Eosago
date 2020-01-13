var $ = require('jquery');
var itemsEqualHeight = require('items-equal-height');

module.exports = function($item, $showAllBtn, $showDifferenceBtn, switchClass, showDifferenceClass) {
	'use strict';

	$showAllBtn.on('click', function(event) {
		event.preventDefault();

		if (!$(this).hasClass(switchClass)) {
			$showDifferenceBtn.removeClass(switchClass);
			$(this).addClass(switchClass);

			$item.removeClass(showDifferenceClass);

			$item.removeData('items-equal-height');
			itemsEqualHeight($item);
		}
	});

	$showDifferenceBtn.on('click', function(event) {
		event.preventDefault();

		if (!$(this).hasClass(switchClass)) {
			$showAllBtn.removeClass(switchClass);
			$(this).addClass(switchClass);

			$item.addClass(showDifferenceClass);

			$item.removeData('items-equal-height');
			itemsEqualHeight($item);
		}
	});
};
