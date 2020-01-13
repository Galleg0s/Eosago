'use strict';

module.exports = {
	parseDay: function(day, month) {
		var monthsLength = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var value = Math.abs(parseInt(day));

		if (isNaN(value) || !value) {return '';}

		return (value <= monthsLength[month - 1]) ? value : monthsLength[month - 1];
	},
	parseYear: function(year, startYear, stopYear) {
		var value = parseInt(year);

		if (isNaN(value) || !value || year.length < 4) {
			return year;
		} else {
			if (value < startYear) {return startYear;}
			if (value > stopYear) {return stopYear;}

			return value;
		}
	},
	validate: function(date) {
		var dateSplitted = date.split('-');
		var day = parseInt(dateSplitted[2]) >= 1 && parseInt(dateSplitted[2]) <= 31;
		var month = parseInt(dateSplitted[1]) >= 1 && parseInt(dateSplitted[1]) <= 12;
		var year = parseInt(dateSplitted[0]) > 1900;

		return day && month && year;
	}
};
