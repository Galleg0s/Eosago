'use strict';

var $ = require('jquery');

var itemsEqualHeight = require('items-equal-height');
var stickyHeader = require('./compare-sticky-header.js');
var differenceSwitcher = require('./compare-switcher.js');
var hoverFixedHeaderTrigger = require('./compare-hover.js');
var scrollHandler = require('./compare-scroll.js');
var bindDelete = require('./compare-delete.js');
var getAutoCalculationInfo = require('./compare-price.js');
var CircleStat = require('ui.circle-stat');

var $compareWidget = $('[data-compare-widget]');
var $table = $('.compare-table[data-table]');
var $fixedHeader = $('.table-header-fixed');
var $controls = $('.compare-controls');
var $scrollBtn = $controls.find('.scroll-btn');
var $closeBtn = $compareWidget.find('[data-close]');
var scrollClass = 'prev';
var controlsFixedClass = 'fixed';
var controlsWidth = 62;

var $differenceSwitcherElement = $('[data-difference-switcher]');
var $showAllBtn = $differenceSwitcherElement.find('[data-show-all]');
var $showDifferenceBtn = $differenceSwitcherElement.find('[data-show-difference]');
var switchClass = 'pseudo-tabs__item--active';
var differenceClass = 'show-difference';

var $ratings = $('[data-rating]');
var overlayClass = 'ui-loading-overlay-big ui-loading-hidden-content';

var STAT_COLORS = ['#e74c3c', '#f26c63', '#ffae26', '#7dcea0', '#7dcea0', '#27ae60', '#27ae60', '#27ae60', '#27ae60', '#27ae60'];

function drawStat() {
	$.each($ratings, function(index, rating) {
		var value = Math.round(parseInt($(rating).data('value')) / 10);

		new CircleStat(rating, {
			size: 60,
			color: STAT_COLORS[value - 1],
			value: value * 10,
			label: value
		});
	});
}

function init() {
	getAutoCalculationInfo($table);
	itemsEqualHeight($table);
	stickyHeader($table, $fixedHeader, $controls, controlsFixedClass, controlsWidth);
	differenceSwitcher($table, $showAllBtn, $showDifferenceBtn, switchClass, differenceClass);
	hoverFixedHeaderTrigger($table.find('.row'), $fixedHeader.find('.cell'));

	if ($table.data('productCount') > 4) {
		scrollHandler($table, $fixedHeader, scrollClass, 'active', $scrollBtn);
	}

	drawStat();

	$compareWidget.removeClass(overlayClass);
	bindDelete($closeBtn);
}

init();
