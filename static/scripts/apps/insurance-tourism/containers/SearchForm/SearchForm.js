import React, { Component } from 'react';
import T from 'prop-types';
import { GridWrapper, GridRow, GridCol } from 'react-ui-2018';
import { connect } from 'react-redux';

import Form from '../../components/SearchForm/SearchForm';
import ModalRoot from '../../containers/ModalRoot/ModalRoot';
import {
	searchPolicies,
	sendCountryChangeAction,
	sendDatesAction,
	sendTouristsChangeAction,
	submitSearchForm
} from '../../redux/modules/search';
import { fetchCountries } from '../../redux/modules/countries';

class SearchForm extends Component {
	static propTypes = {
		isAjax: T.bool,
		submitUrl: T.string.isRequired,
		isResultPage: T.bool,
		sendCountryChangeAction: T.func,
		sendDatesAction: T.func,
		sendTouristsChangeAction: T.func,
		onMount: T.func,
	};

	static defaultProps = {
		isAjax: false,
		isResultPage: false,
	};

	componentDidMount() {
		this.props.fetchCountries();
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	onSubmit = values => {
		const { tourists } = values;
		// событие на “Найти страховку”
		pushGtmEvent('VZR_SERVIS', 'click_button_search', undefined, undefined);
		this.props.sendTouristsChangeAction(tourists);
		this.props.searchPolicies(values, false);
	};

	onCountryChange = (event, value) => {
		this.props.sendCountryChangeAction(value);
	};

	onDatesChange = (event, value) => {
		const { startDate, endDate } = value;
		this.props.sendDatesAction(startDate, endDate);
	};

	render() {
		return (
			<div>
				<Form
					onFormSubmit={ this.onSubmit }
					onCountryChange={ this.onCountryChange }
					onDatesChange={ this.onDatesChange }
					isResultPage={ this.props.isResultPage }
				/>
				<ModalRoot />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

export default connect(mapStateToProps, {
	searchPolicies,
	fetchCountries,
	submitSearchForm,
	sendCountryChangeAction,
	sendDatesAction,
	sendTouristsChangeAction,
})(SearchForm);
