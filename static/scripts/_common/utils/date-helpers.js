'use strict';

module.exports = {
	formatValue: function(value) {
		return value ? value.slice(0, 10).split('-').reverse().join('.') : '';
	},
	convertStringToDateObject: function(value) {
		var date = new window.Date(value);

		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	},
	isValueInRange: function(value, from, to) {
		var date = new window.Date(value);
		var dateFrom = new window.Date(from.year, from.month - 1, from.day, 0, 0, 0, 0);
		var dateTo = new window.Date(to.year, to.month - 1, to.day, 0, 0, 0, 0);

		return date.getTime() >= dateFrom.getTime() && date.getTime() <= dateTo.getTime();
	}
};
