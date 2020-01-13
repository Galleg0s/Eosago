var $ = require('jquery');
var Helpers = require('helpers');

module.exports = function($table, $fixedHeader, $controls, controlsFixedClass, controlsWidth) {
	'use strict';

	var $tableHeaderCell = $table.find('.cell.title');
	var $tableHeaderHeight = $tableHeaderCell.height();
	var $tableOffsetTop = $table.offset().top;
	var $tableHeaderTop = $tableOffsetTop + $tableHeaderHeight;
	var scrollLeft = $(window).scrollLeft();

	function calculation() {
		$fixedHeader.css({
			width: $table.outerWidth()
		});

		$controls.css({
			left: $table.offset().left - scrollLeft + $table.outerWidth() - controlsWidth + 20 // 20 padding from right border
		});
	}

	function stickTableHeader(viewport) {
		var $tableBottom = $tableOffsetTop + $table.height() - $tableHeaderHeight;
		var y = viewport.scrollTop();
		var x = viewport.scrollLeft();

		if (x !== scrollLeft) {
			$fixedHeader.css({
				left: x ? $table.offset().left - x : 'auto'
			});

			$controls.css({
				left: $table.offset().left - x + $table.outerWidth() - controlsWidth + 20 // 20 padding from right border
			});

			scrollLeft = x;
		}

		if (y <= $tableHeaderTop || y >= $tableBottom) {
			$fixedHeader.fadeOut(100);
			$controls.removeClass(controlsFixedClass);
		} else {
			$controls.addClass(controlsFixedClass);
			$fixedHeader.fadeIn();
		}
	}

	// stick or unstick table header on window scroll
	$(window).scroll(function() {
		stickTableHeader($(this));
	});

	// stick or unstick table header after page load
	setTimeout(function() {
		calculation();
		stickTableHeader($(window));
	}, 1000);

	// stick or unstick table header on window resize
	$(window).on('resize', Helpers.debounce(function() {
		calculation();
		stickTableHeader($(this));
	}, 0));
};
