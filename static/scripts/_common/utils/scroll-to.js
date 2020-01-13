'use strict';

var $ = require('jquery');

module.exports = scrollTo;

function scrollTo(position, callback) {
	$('html, body').animate({
		scrollTop: position
	}, 600, function() {
		if (callback && typeof(callback) === 'function') {
			callback();
		}
	});
}
