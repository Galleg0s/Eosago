import $ from 'jquery';
import router from 'router';
import Bloodhound from 'bloodhound';
import 'typeahead';

function State(data, onUpdateCallback) {
	this._data = Object.assign({}, data);
	this._onUpdateCallback = onUpdateCallback || function() {};
}

State.prototype = {
	_callOnUpdate: function() {
		this._onUpdateCallback(this.getData());
	},
	getProp: function(propName) {
		return this._data[propName];
	},
	setProp: function(propName, value) {
		this._data[propName] = value;

		this._callOnUpdate();
	},
	getData: function() {
		return Object.assign({}, this._data);
	},
	setData: function(data) {
		this._data = Object.assign({}, this._data, data);

		this._callOnUpdate();
	}
};

function createCarSelectWidget(container, options) {
	var $container = $(container);
	var source = options && options.source ? options.source : 'widget_minicalc';
	var OSAGO = 'osago';
	var KASKO = 'kasko';
	var BRAND = 'brand';
	var MODEL = 'model';
	var YEAR = 'year';
	var TITLE_KEY = 'title';
	var PLACEHOLDER_MAP = {};
	var URL_MAP = {};
	var TRANSFORM_FUNCTION_MAP = {};
	var AUTO_FOCUS_MAP = {};

	PLACEHOLDER_MAP[BRAND] = 'Марка автомобиля';
	PLACEHOLDER_MAP[MODEL] = 'Модель автомобиля';
	PLACEHOLDER_MAP[YEAR] = 'Год';

	URL_MAP[BRAND] = function(data) {
		return router.generate('bankiru_insurance_order_auto_brand_reference', {})
	};
	URL_MAP[MODEL] = function(data) {
		var brand = data[BRAND];

		return router.generate('bankiru_insurance_order_auto_models_reference_without_years', {brand_id: brand.id});
	};
	URL_MAP[YEAR] = function(data) {
		var model = data[MODEL];

		return router.generate('bankiru_insurance_order_auto_models_years', {model_id: model.id});
	};

	TRANSFORM_FUNCTION_MAP[BRAND] = function(response) {
		var result = [];

		if (response) {
			Object.keys(response).forEach(function(key) {
				result.push(response[key]);
			});
		}

		return result;
	};
	TRANSFORM_FUNCTION_MAP[MODEL] = function(response) {
		return response;
	};
	TRANSFORM_FUNCTION_MAP[YEAR] = function(response) {
		var result = [];

		if (response) {
			response.forEach(function(item) {
				result.push({
					id: item,
					title: String(item),
					urlName: String(item)
				});
			});
		}

		return result;
	};

	AUTO_FOCUS_MAP[BRAND] = [BRAND];
	AUTO_FOCUS_MAP[MODEL] = [BRAND, MODEL];
	AUTO_FOCUS_MAP[YEAR] = [MODEL, YEAR];

	var $osagoInput = $container.find('[data-osago-input]');
	var $kaskoInput = $container.find('[data-kasko-input]');
	var $message = $container.find('[data-message]');

	var $carInputContainer = $container.find('[data-car-input]');
	var $carInput = $carInputContainer.find('input[name="car"]');

	var $brandTagContainer = $container.find('[data-brand-tag]');
	var $brandTagTitle = $brandTagContainer.find('[data-brand-tag-title]');
	var $brandTagDelete = $brandTagContainer.find('[data-brand-tag-delete]');

	var $modelTagContainer = $container.find('[data-model-tag]');
	var $modelTagTitle = $modelTagContainer.find('[data-model-tag-title]');
	var $modelTagDelete = $modelTagContainer.find('[data-model-tag-delete]');

	var $yearTagContainer = $container.find('[data-year-tag]');
	var $yearTagTitle = $yearTagContainer.find('[data-year-tag-title]');
	var $yearTagDelete = $yearTagContainer.find('[data-year-tag-delete]');

	var $linkContainer = $container.find('[data-link]');
	var $link = $linkContainer.find('.button');

	var INITIAL_STATE = {
		osago: $osagoInput.prop('checked'),
		kasko: $kaskoInput.prop('checked'),
		brand: null,
		model: null,
		year: null
	};
	var state = new State(INITIAL_STATE, updateView);

	var TEMPLATE_EMPTY = '<div class="empty-massage">Совпадений не найдено</div>';
	var USE_BLOODHOUND_CACHE = false;
	var TYPEAHEAD_DEFAULT_SETTINGS = {
		hint: true,
		highlight: true,
		minLength: 0,
		classNames: {
			menu: 'tt-menu tt-menu--scrollable'
		}
	};

	var lastUpdatedProp = null;

	init();

	function init() {
		bindEventListeners();
		updateView(state.getData());
	}

	function bindEventListeners() {
		$osagoInput.on('change', function() {
			lastUpdatedProp = OSAGO;
			state.setProp(OSAGO, $osagoInput.prop('checked'));
		});

		$kaskoInput.on('change', function() {
			lastUpdatedProp = KASKO;
			state.setProp(KASKO, $kaskoInput.prop('checked'));
		});

		$brandTagDelete.on('click', function() {
			lastUpdatedProp = BRAND;
			state.setData({
				brand: null,
				model: null,
				year: null
			});
		});

		$modelTagDelete.on('click', function() {
			lastUpdatedProp = MODEL;
			state.setData({
				model: null,
				year: null
			});
		});

		$yearTagDelete.on('click', function() {
			lastUpdatedProp = YEAR;
			state.setProp(YEAR, null);
		});
	}

	function updateView(data) {
		var brand = data[BRAND];
		var model = data[MODEL];
		var year = data[YEAR];

		toggleContainersVisibility(data);

		destroyTypeaheadInput($carInput);

		if (brand === null) {
			initInput($carInput, BRAND);
		} else {
			$brandTagTitle.text(brand.title);

			if (model === null) {
				initInput($carInput, MODEL);
			} else {
				$modelTagTitle.text(model.title);

				if (year === null) {
					initInput($carInput, YEAR);
				} else {
					$yearTagTitle.text(year.title);
					$link.attr('href', generateLink(data));
					$link.focus();
				}
			}
		}
	}

	function needAutoFocus(type) {
		return AUTO_FOCUS_MAP[type].indexOf(lastUpdatedProp) !== -1
	}

	function toggleContainersVisibility(data) {
		var insuranceTypeNotSelected = !data.osago && !data.kasko;
		var brandIsNull = data.brand === null;
		var modelIsNull = data.model === null;
		var yearIsNull = data.year === null;
		var hiddenClass = 'hidden';

		$carInputContainer.toggleClass(hiddenClass, !yearIsNull || insuranceTypeNotSelected);

		$message.toggleClass(hiddenClass, !insuranceTypeNotSelected);

		$brandTagContainer.toggleClass(hiddenClass, brandIsNull || insuranceTypeNotSelected);
		$modelTagContainer.toggleClass(hiddenClass, modelIsNull || insuranceTypeNotSelected);
		$yearTagContainer.toggleClass(hiddenClass, yearIsNull || insuranceTypeNotSelected);

		$linkContainer.toggleClass(hiddenClass, yearIsNull || insuranceTypeNotSelected);
	}

	function initTypeaheadInput($inputElement, typeaheadSettings, datumSettings, onSelectCallback) {
		$inputElement.typeahead(typeaheadSettings, datumSettings);

		$inputElement.on('typeahead:select typeahead:autocomplete', function(event, suggestion) {
			if (onSelectCallback && typeof onSelectCallback === 'function') {
				onSelectCallback(suggestion);
			}
		});
	}

	function destroyTypeaheadInput($inputElement) {
		$inputElement.trigger('blur.tt');
		$inputElement.typeahead('val', '');
		$inputElement.typeahead('destroy');

		$inputElement.off('typeahead:select typeahead:autocomplete');
	}

	function forceTypeaheadUpdate($inputElement) {
		var currentValue = $inputElement.typeahead('val');
		var newValue = currentValue + '_';

		$inputElement.typeahead('val', newValue);
		$inputElement.typeahead('val', currentValue);
	}

	function triggerFocus($inputElement) {
		$inputElement.trigger('focus.tt');
	}

	function setPlaceholder($inputElement, type) {
		$inputElement.attr('placeholder', PLACEHOLDER_MAP[type]);
	}

	function createEngineReadyCallback($inputElement, autoFocus) {
		return function() {
			forceTypeaheadUpdate($inputElement);

			if (autoFocus) {
				triggerFocus($inputElement);
			}
		};
	}

	function createEngineWithDefaults(engine, limit) {
		return function(query, sync) {
			if (query === '') {
				sync(limit ? engine.all().slice(0, limit) : engine.all());
			} else {
				engine.search(query, sync);
			}
		};
	}

	function createOnSelectCallback(propName) {
		return function(result) {
			lastUpdatedProp = propName;
			state.setProp(propName, result);
		};
	}

	function initInput($targetElement, type) {
		var engine = new Bloodhound({
			initialize: false,
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace([TITLE_KEY]),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			prefetch: {
				url: URL_MAP[type](state.getData()),
				transform: TRANSFORM_FUNCTION_MAP[type],
				cache: USE_BLOODHOUND_CACHE
			}
		});
		var datumSettings = {
			source: createEngineWithDefaults(engine),
			display: TITLE_KEY,
			limit: Infinity,
			templates: {
				empty: TEMPLATE_EMPTY
			}
		};
		var autoFocus = needAutoFocus(type);

		initTypeaheadInput($targetElement, TYPEAHEAD_DEFAULT_SETTINGS, datumSettings, createOnSelectCallback(type));
		setPlaceholder($targetElement, type);

		if (autoFocus) {
			triggerFocus($targetElement);
		}

		engine.initialize().done(createEngineReadyCallback($targetElement, autoFocus));
	}

	function generateLink(data) {
		var routeName = 'bankiru_insurance_order_autocalc_brand_model_year';
		var osago = data[OSAGO];
		var kasko = data[KASKO];
		var brand = data[BRAND];
		var model = data[MODEL];
		var year = data[YEAR];
		var parameters = {
			brand: brand.urlName,
			model: model.urlName,
			year: year.urlName,
			source: source
		};

		if (osago !== kasko) {
			routeName = 'bankiru_insurance_order_autocalc_insurance_type_brand_model_year';

			parameters.insurance_type = osago ? OSAGO : KASKO;
		}

		return router.generate(routeName, parameters);
	}
}

module.exports = createCarSelectWidget;
