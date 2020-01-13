'use strict';

var AppDispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var API = require('../utils/api.js');
var extend = require('lodash/extend');
var forEach = require('lodash/forEach');

var _banks = {
	items: null
};

var _antiTheftSystems = {
	items: null
};

var _tips = {
	items: []
};

var DataStore = extend({}, EventEmitter.prototype, {
	getBanksList: function() {
		if (_banks.items === null) {
			this._getBanksData();
		}

		return _banks.items;
	},

	_getBanksData: function() {
		_banks.items = [];

		API.getBanks(function(responseData) {
			_banks.items.length = 0;

			responseData.result.data.forEach(function(item) {
				_banks.items.push({
					name: item.bank_name,
					id: parseInt(item.bank_id)
				});
			});

			DataStore.emitReceiveData();
		});
	},

	getAntiTheftSystemsList: function() {
		if (_antiTheftSystems.items === null) {
			this._getAntiTheftSystemsData();
		}

		return _antiTheftSystems.items;
	},

	_getAntiTheftSystemsData: function() {
		_antiTheftSystems.items = [];

		API.getAntiTheftSystems(function(responseData) {
			_antiTheftSystems.items.length = 0;

			forEach(responseData.result, function(item) {
				_antiTheftSystems.items.push({
					name: item.brand_name + ' - ' + item.model_name,
					id: item.id
				});
			});

			DataStore.emitReceiveData();
		});
	},

	getTips: function() {
		return _tips.items;
	},

	setTips: function(tips) {
		_tips.items = tips.slice();
		DataStore.emitReceiveData();
	},

	getUserRegion: function(id, callback) {
		API.getRegion(id, function(response) {
			if (callback && typeof(callback) === 'function') {
				callback(response);
			}
		});
	},

	// events
	emitReceiveData: function() {
		this.emit('receive');
	},
	addReceiveDataListener: function(callback) {
		this.on('receive', callback);
	},
	removeReceiveDataListener: function(callback) {
		this.removeListener('receive', callback);
	}
});

AppDispatcher.register(function(event) {
	switch (event.action) {
		case 'UPDATE_BANK_LIST':
			_banks.items = _banks.items.map(function(item) {
				item.selected = (item.id === event.value);

				return item;
			});
			break;

		case 'UPDATE_ANTI_THEFT_SYSTEMS_LIST':
			_antiTheftSystems.items = _antiTheftSystems.items.map(function(item) {
				item.selected = (item.id === event.value);

				return item;
			});
			break;

		default:
			break;
	}
});

module.exports = DataStore;
