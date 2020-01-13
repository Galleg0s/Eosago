import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { GridRow, GridCol } from 'react-ui-2018';
import { optionType } from '../../types';
import { emptyFunction } from '../../utils/utils';
import AmountSelect from '../../components/AmountSelect/AmountSelect';
import OptionsSelect from '../../components/OptionsSelect/OptionsSelect';
import MobileOptions from '../../components/MobileOptions/MobileOptions';
import {
	searchOptionsSelector,
	updateSearchParameters,
	searchResultsCurrencySelector,
	searchParametersSelector,
	searchPolicies,
} from '../../redux/modules/search';
import { fetchOptionsSubrisk, fetchOptionsSport } from '../../redux/modules/options';

class SearchParameters extends Component {
	static propTypes = {
		fetchOptionsSubrisk: T.func,
		fetchOptionsSport: T.func,
		searchParametersSelector: T.shape(),
		searchPolicies: T.func,
		selectedOptions: T.arrayOf(optionType),
		updateSearchParameters: T.func,
	};

	static defaultProps = {
		fetchOptionsSubrisk: emptyFunction,
		fetchOptionsSport: emptyFunction,
		searchPolicies: emptyFunction,
		updateSearchParameters: emptyFunction,
		searchParameters: {},
	};

	componentDidMount() {
		this.props.fetchOptionsSubrisk();
		this.props.fetchOptionsSport(220, '01-10-2018');
	}

	onOptionsSelect = options => {
		const { searchParameters } = this.props;
		this.props.searchPolicies({
			...searchParameters,
			options,
		});
		this.props.updateSearchParameters({ options });
	};

	onInsuranceAmountSelect = (insuranceAmount, currency) => {
		const { searchParameters } = this.props;
		this.props.searchPolicies({
			...searchParameters,
			insuranceAmount,
			currency,
		});
		this.props.updateSearchParameters({ insuranceAmount, currency });
	};

	get desctopContent() {
		const {
			searchParameters,
		} = this.props;

		return (
			<Fragment>
				<AmountSelect
					options={ [30000, 35000, 40000, 50000, 75000, 100000] }
					currency={ searchParameters.currency || 'EUR' }
					value={ searchParameters.insuranceAmount || 30000 }
					onChange={ this.onInsuranceAmountSelect }
				/>
				<GridRow>
					<GridCol sm={ 4 } md={ 12 }>
						<OptionsSelect
							title="Страхование здоровья"
							titleTip="Добавьте дополнительные опции, чтобы сделать вашу поездку максимально защищенной."
							value={ searchParameters.options }
							optionsType="optionsSubrisk"
							onChange={ this.onOptionsSelect }
						/>
					</GridCol>
					<GridCol sm={ 4 } md={ 12 }>
						<OptionsSelect
							title="Спорт и активный отдых"
							titleTip="Любительский спорт"
							value={ searchParameters.options }
							optionsType="optionsSport"
							onChange={ this.onOptionsSelect }
						/>
					</GridCol>
				</GridRow>
			</Fragment>
		);
	}

	get mobileContent() {
		const {
			searchParameters,
		} = this.props;

		return (
			<Fragment>
				<AmountSelect
					options={ [30000, 35000, 40000, 50000, 75000, 100000] }
					currency={ searchParameters.currency || 'EUR' }
					value={ searchParameters.insuranceAmount || 30000 }
					onChange={ this.onInsuranceAmountSelect }
					size="small"
				/>
				<div className="margin-top-small-fixed">
					<MobileOptions searchParameters={ searchParameters } />
				</div>
			</Fragment>
		)
	}

	get searchParametersContent() {
		if (banki.env.isMobileDevice) {
			return this.mobileContent;
		} else {
			return this.desctopContent;
		}
	}

	render() {
		return (
			<div>
				{ this.searchParametersContent }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		searchParameters: searchParametersSelector(state),
	};
}

export default connect(mapStateToProps, {
	fetchOptionsSubrisk,
	fetchOptionsSport,
	searchPolicies,
	updateSearchParameters,
})(SearchParameters);
