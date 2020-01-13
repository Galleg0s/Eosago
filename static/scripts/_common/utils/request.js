'use strict';

var $ = require('jquery');

module.exports = {
	post: function(url, data, successCallback, errorCallback) {
		return $.ajax({
			type: 'POST',
			url: url,
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify(data)
		}).done(function(response) {
			if (successCallback) {
				successCallback(response);
			}
		}).fail(function(response) {
			if (errorCallback) {
				errorCallback(response);
			}
		});
	},
	get: function(url, data, successCallback, errorCallback) {
		return $.ajax({
			type: 'GET',
			url: url,
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			data: data ? $.param(data) : null
		}).done(function(response) {
			if (successCallback) {
				successCallback(response);
			}
		}).fail(function(response) {
			if (errorCallback) {
				errorCallback(response);
			}
		});
	}
};
