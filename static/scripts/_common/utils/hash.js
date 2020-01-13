'use strict';

module.exports = {
	get: function() {
		return window.location.hash.replace(/^#\/?/, '');
	},
	set: function(hash) {
		if (history.pushState) {
			history.pushState(null, null, '#' + hash);
		} else {
			window.location.hash = '#' + hash;
		}
	},
	redirect: function(url, hash) {
		window.location = location.protocol + '//' + location.host + url + '#' + hash;
	}
};
