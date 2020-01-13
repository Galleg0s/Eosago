var $ = require('jquery');
var compareStorage = require('../../_common/utils/compare-storage.js');

module.exports = function($close) {
	'use strict';

	$close.on('click', function() {
		var path = $(this).data('href');
		var id = $(this).data('close');

		compareStorage.delete(id);
		window.location.href = path;
	});
};
