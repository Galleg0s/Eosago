'use strict';

var AppDispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var UserStore = require('./user-store.js');
var FormStore = require('./form-store.js');
var API = require('../utils/api.js');
var extend = require('lodash/extend');
var map = require('lodash/map');
var findIndex = require('lodash/findIndex');

var _cars = {
	brands: [],
	models: {},
	years: {},
	power: {},
	modifications: {},
	mileage: FormStore.getMileageTypes()
};

var CarStore = extend({}, EventEmitter.prototype, {
	setCarBrands: function(brands) {
		_cars.brands = map(brands, function(brand) {
			return brand;
		});
	},

	getCarBrands: function() {
		return _cars.brands;
	},

	getItems: function() {
		const data = UserStore.getData();

		const code = this._getCurrentCode(data);

		switch (code) {

			case 'model': {
				const brandId = Object.values(data.car).find(e => e.code === 'brand').id;

				if (_cars.models && _cars.models[brandId]) {
					return Object.values(_cars.models[brandId]);
				} else {
					this._getModels(brandId);
				}
				break;
			}

			case 'year': {
				const modelId = data.car.find(e => e.code === 'model').id;

				if (_cars.years && _cars.years[modelId]) {
					return _cars.years[modelId].sort((a,b) => a.title < b.title ? 1 : -1);
				} else {
					this._getYears(modelId);
				}
				break;
			}

			case 'modification': {
				const year = Object.values(data.car).find(e => e.code === 'year').id;
				const modelId = data.car.find(e => e.code === 'model').id;

				if (_cars.modifications[modelId] && _cars.modifications[modelId][year]) {
					return _cars.modifications[modelId][year].map(item => ({
						id: item.id,
						title: item.serie_modification_name,
						power: item.filtered_characteristics.length ?
							{id: item.filtered_characteristics[0].id, value: item.filtered_characteristics[0].value} :
							{}
					}))
				} else {
					this._getModification(modelId, year);
				}
				break;
			}

			case 'mileage':
				return map(_cars.mileage, function(item) {
					return {id: item.id, title: item.title};
				});

			default:
				break;
		}
	},

	_getCurrentCode: function(data) {
		return data.car[findIndex(data.car, {id: null})].code;
	},

	_getModels: function(brand_id) {
		if (brand_id) {
			API.getCarModels(brand_id, function(models) {
				_cars.models[brand_id] = models;
				CarStore.emitRecieveData();
			});
		}
	},

	_getYears: function(modelId) {
		if (modelId) {
			API.getCarYears(modelId, function(years) {
				_cars.years[modelId] = years.map(e => ({title: e, id: e}));
				CarStore.emitRecieveData();
			})
		}
	},

	_getModification: function(model_id, year) {
		if (model_id) {
			API.getCarModifications(model_id, year, function(modifications) {
				if (!_cars.modifications[model_id]) {
					_cars.modifications[model_id] = {};
				}

				_cars.modifications[model_id][year] = modifications;
				CarStore.emitRecieveData();
			});
		}
	},

	// events
	emitRecieveData: function() {
		this.emit('recieve');
	},
	addRecieveDataListener: function(callback) {
		this.on('recieve', callback);
	},
	removeRecieveDataListener: function(callback) {
		this.removeListener('recieve', callback);
	}
});

AppDispatcher.register(function(event) {
	switch (event.action) {
		case 'SET_CAR_COST':
			UserStore.setCost(100000, 10000000);
			UserStore.emitChange();
			break;

		default:
			break;
	}
});

module.exports = CarStore;
