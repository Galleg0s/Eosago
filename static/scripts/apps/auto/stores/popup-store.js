'use strict';

var $ = require('jquery');
var UserStore = require('./user-store.js');
var ResultStore = require('./result-store.js');
var Popup = require('ui.popup');
var UniversalRegionSelector = require('universal-select-region');
var Agreement = require('../../../_common/data/agreement.js');
var postMessage = require('../../../_common/utils/post-message.js');

var widgetMode = ResultStore.getWidgetId() !== null;
var POPUPS = {
	agreementPopup: {
		id: '',
		instance: $.popup({
			content: Agreement,
			width: '1000px',
			onAfterShow: _onAfterShowCallback
		})
	},
	carWidgetPopup: {
		id: 'react-widget-car',
		instance: $.popup({
			content: '<div><div id="react-widget-car"></div></div>',
			width: '550px',
			contentPadding: false,
			canUserClose: false,
			onAfterShow: function(popupInstance) {
				UserStore.emitChange();

				_onAfterShowCallback(popupInstance);
			}
		})
	},
	progressWidgetPopup: {
		id: 'react-widget-progress',
		instance: $.popup({
			content: '<div><div id="react-widget-progress"></div></div>',
			width: '600px',
			contentPadding: false,
			canUserClose: false,
			onAfterShow: _onAfterShowCallback
		})
	},
	leadPopup: {
		id: 'react-popup-lead',
		instance: $.popup({
			content: '<div><div id="react-popup-lead"></div></div>',
			width: '550px',
			contentPadding: false,
			canUserClose: false,
			onAfterShow: _onAfterShowCallback
		})
	}
};

$(document).on('regionselector:loaded', _onUSRLoadedCallback);

UniversalRegionSelector.initialize({
	trigger: '.usr__trigger',
	disableRedirect: true,
	disableTabs: true,
	useEventDelegation: true,
	onSelect: UserStore.setRegionData
});

function _onAfterShowCallback(popupInstance) {
	if (widgetMode) {
		_sendPopupOffsetTop(popupInstance.$popup);
	}
}

function _onUSRLoadedCallback(event) {
	if (widgetMode) {
		_sendPopupOffsetTop(event.target);
	}
}

function _sendPopupOffsetTop(popupInstance) {
	setTimeout(function() {
		postMessage({
			type: 'scroll',
			param: 'popupOffsetTop',
			value: $(popupInstance).offset().top
		});
	}, 400 * 2);
}

function _getPopupProperty(popupName, propertyName) {
	return POPUPS[popupName][propertyName];
}

var PopupStore = {
	getPopup: function(popupName) {
		return _getPopupProperty(popupName, 'instance');
	},

	getPopupIdAttribute: function(popupName) {
		return _getPopupProperty(popupName, 'id');
	}
};

module.exports = PopupStore;
