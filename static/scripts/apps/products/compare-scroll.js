var $ = require('jquery');

module.exports = function($table, $fixedHeader, scrollClass, activeClass, $moveBtn) {
	'use strict';

	$moveBtn.on('click', function(e) {
		e.preventDefault();

		if ($(this).attr('data-disabled') !== undefined || $table.hasClass('animated')) {
			return;
		}

		move($(this).data('direction'));
	});

	function move(direction) {
		$table.addClass('animated');
		$fixedHeader.addClass('animated');

		var $movedTableRow;
		var $movedFixedHeaderItem;
		var $movedTableRowLastActive = $table.find('.row.' + activeClass).last();
		var $movedFixedHeaderItemLastActive = $fixedHeader.find('.cell.' + activeClass).last();

		if (direction === 'next') {
			$movedTableRow = $table.find('.row.' + activeClass).first();
			$movedFixedHeaderItem = $fixedHeader.find('.cell.' + activeClass).first();

			$movedTableRow.removeClass(activeClass).addClass(scrollClass);
			$movedFixedHeaderItem.removeClass(activeClass).addClass(scrollClass);

			$movedTableRowLastActive.next().addClass(activeClass);
			$movedFixedHeaderItemLastActive.next().addClass(activeClass);
		} else {
			$movedTableRow = $table.find('.row.' + scrollClass).last();
			$movedFixedHeaderItem = $fixedHeader.find('.cell.' + scrollClass).last();

			$movedTableRow.removeClass(scrollClass).addClass(activeClass);
			$movedFixedHeaderItem.removeClass(scrollClass).addClass(activeClass);

			$movedTableRowLastActive.removeClass(activeClass);
			$movedFixedHeaderItemLastActive.removeClass(activeClass);
		}

		$movedTableRow.one('transitionend', function() {
			$table.removeClass('animated');
			$fixedHeader.removeClass('animated');
		});

		checkDisable($movedTableRow);
	}

	function checkDisable() {
		if ($table.find('.row.' + scrollClass).length) {
			$moveBtn.filter('[data-direction="prev"]').removeAttr('data-disabled');
		} else {
			$moveBtn.filter('[data-direction="prev"]').attr('data-disabled', true);
		}

		if ($table.find('.row').last().hasClass(activeClass)) {
			$moveBtn.filter('[data-direction="next"]').attr('data-disabled', true);

			$table.addClass('no-fade');
			$fixedHeader.addClass('no-fade');
		} else {
			$moveBtn.filter('[data-direction="next"]').removeAttr('data-disabled');

			$table.removeClass('no-fade');
			$fixedHeader.removeClass('no-fade');
		}
	}
};
