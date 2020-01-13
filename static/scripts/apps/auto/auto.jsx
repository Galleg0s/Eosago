import React from 'react';
import ReactDOM from 'react-dom';
import CarStore from './stores/car-store.js';
import UserStore from './stores/user-store.js';
import ResultStore from './stores/result-store.js';
import SeoStore from './stores/seo-store.js';
import PopupStore from './stores/popup-store.js';
import API from './utils/api.js';
import Hash from '../../_common/utils/hash.js';
import AutoForm from './components/form.jsx';
import CarWidget from './components/car-widget.jsx';
import LeadPopup from './components/lead-popup.jsx';
import ProgressWidget from './components/progress-widget.jsx';
import TipsWidget from './components/tips-widget.jsx';
import ExplanationWidget from './components/explanation-widget.jsx';
import Result from './components/result.jsx';

const hash = Hash.get();
const carWidgetPopupId = PopupStore.getPopupIdAttribute('carWidgetPopup');
const progressWidgetPopupId = PopupStore.getPopupIdAttribute('progressWidgetPopup');
const carWidgetElement = document.getElementById(carWidgetPopupId);
const leadPopupElement = document.getElementById(PopupStore.getPopupIdAttribute('leadPopup'));
const progressWidgetElement = document.getElementById(progressWidgetPopupId);

export default params => {
	function render() {
		ReactDOM.render(<AutoForm />, params.formElement);
		ReactDOM.render(<CarWidget />, carWidgetElement);
		ReactDOM.render(<LeadPopup />, leadPopupElement);
		ReactDOM.render(<ProgressWidget />, progressWidgetElement);

		if (params.tipsWidgetElement) {
			ReactDOM.render(<TipsWidget />, params.tipsWidgetElement);
		}

		ReactDOM.render(<Result />, params.resultElement);

		if (params.explanationWidgetElement) {
			ReactDOM.render(<ExplanationWidget />, params.explanationWidgetElement);
		}
	}

	SeoStore.setSeoData();
	UserStore.setConfigData();
	API.getCarBrands(function(brands) {
		CarStore.setCarBrands(brands);

		if (hash) {
			ResultStore.calculate(hash, null, function() {
				render();
			});
		} else {
			render();
		}
	});
}
