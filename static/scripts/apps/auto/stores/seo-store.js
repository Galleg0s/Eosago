'use strict';

var AppDispatcher = require('../dispatcher/dispatcher.js');
var UserStore = require('../stores/user-store.js');
var SeoData = require('auto.seo-data');
var forEach = require('lodash/forEach');

module.exports = {
	setSeoData: function() {
		forEach(SeoData, function(item, key) {
			switch (key) {
				case 'type':
					var types = UserStore.getTypes();
					types = Object.keys(types);

					types.forEach(function(type) {
						if (item !== type) {
							AppDispatcher.dispatch({
								action: 'TOGGLE_ORDER_TYPE',
								type: type
							});
						}
					});
					break;

				case 'brand':
				case 'model':
				case 'year':
					AppDispatcher.dispatch({
						action: 'SELECT_CAR_PROPERTY',
						code: key,
						data: item
					});
					break;

				default:
					AppDispatcher.dispatch({
						action: 'UPDATE',
						field: key,
						data: item
					});
					break;
			}
		});
	}
};
