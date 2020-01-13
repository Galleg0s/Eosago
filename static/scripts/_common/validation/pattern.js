'use strict';

module.exports = {
	validate: function(value, pattern) {
		var re = new RegExp(pattern.slice(1, -1), 'i');

		return re.test(value);
	}
};
