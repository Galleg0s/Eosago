import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import createStore from './redux/create';
import Purchase from './containers/Purchase/Purchase';
import SearchForm from './containers/SearchForm/SearchForm';
import SearchParameters from './containers/SearchParameters/SearchParameters';
import SearchResults from './containers/SearchResults/SearchResults';
import HowItWorks from './containers/HowItWorks/HowItWorks';
import AboutInfo from './containers/AboutInfo/AboutInfo';
import SEOBlock from './containers/SEOBlock/SEOBlock';
import ApiClient from './services/api';

moment.locale('ru');

class InsuranceTourism {
	static instance;

	constructor(config) {
		// Singleton check
		if (InsuranceTourism.instance) {
			return InsuranceTourism.instance;
		}

		const apiUrl = config.apiUrl || '/api/v1';
		const partnerId = config.partnerId || 'd08b95061d290caf3c58056a7e08c0bb';
		const api = new ApiClient({
			baseUrl: apiUrl,
			agentId: config.agentId,
			partnerId,
		});
		const store = createStore(api, config.initialState);
		this.renderComponent = (Component, containerEl, props) => {
			const Wrapper = (
				<Provider store={ store }>
					<Component { ...props } />
				</Provider>
			);
			ReactDOM.render(Wrapper, containerEl);
		};
		InsuranceTourism.instance = this;
	}

	renderSearchForm = (container, props) =>
		this.renderComponent(SearchForm, container, props);

	renderSearchParameters = (container, props) =>
		this.renderComponent(SearchParameters, container, props);

	renderSearchResults = (container, props) =>
		this.renderComponent(SearchResults, container, props);

	renderPurchaseForm = (container, props) =>
		this.renderComponent(Purchase, container, props);

	renderHowItWorks = (container, props) =>
		this.renderComponent(HowItWorks, container, props);

	renderAboutAccordion = (container, props) =>
		this.renderComponent(AboutInfo, container, props);

	renderSEOBlock = (container, props) =>
		this.renderComponent(SEOBlock, container, props);
}

module.exports = InsuranceTourism;
