import storage from 'temporaryStorage';
import router from 'router';

var _name = 'bankiru_insurance_compare';
var _link = router.generate('bankiru_insurance_products_compare');
var _event = new CustomEvent('updateCompare');
var _maxLength = 8;
var _data = {type: null, ids: []};

module.exports = {
	_update: function() {
		var data;

		try {
			data = storage.get(_name);
		} catch (err) {
			console.warn(err);
		}

		_data = data ? data : _data || {type: null, ids: []};
	},
	_set: function() {
		try {
			storage.set(_name, _data);
			document.dispatchEvent(_event);
		} catch (err) {
			console.warn(err);
		}
	},
	add: function(type, id) {
		this._update();

		if (_data && _data.type === type) {
			if (_data.ids.indexOf(id) === -1) {
				_data.ids.unshift(id);

				if (_data.ids.length > _maxLength) {
					_data.ids.splice(_maxLength);
				}
			}
		} else {
			_data = {
				type: type,
				ids: [id]
			};
		}

		this._set();
	},
	'delete': function(id) {
		this._update();

		if (_data) {
			for (var i = 0; i < _data.ids.length; i++) {
				if (_data.ids[i] === id) {
					_data.ids.splice(i, 1);
					this._set();
				}
			}
		}
	},
	reset: function() {
		_data = {type: null, ids: []};
		this._set();
	},
	getCount: function() {
		this._update();

		return _data.ids.length;
	},
	getLink: function() {
		this._update();

		if (_data.ids.length) {
			return _link + '?t=' + _data.type + '&p=' + _data.ids.join(',');
		} else {
			return null;
		}
	},
	isInCompare: function(id) {
		this._update();

		return _data.ids.indexOf(id) !== -1;
	}
};

