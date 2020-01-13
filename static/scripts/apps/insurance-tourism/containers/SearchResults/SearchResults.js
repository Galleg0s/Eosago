import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { ExpandableList, Panel, ProgressBar } from 'react-ui-2018';
import SearchResultsList from '../../components/SearchResultsList/SearchResultsList';
import NotFound from '../../components/NotFound/NotFound';
import { calculationResult } from '../../types';
import {
	searchResultsSelector,
	isSearchingSelector,
	searchProgressSelector,
	searchParametersSelector,
	searchPolicies,
} from '../../redux/modules/search';

class SearchResults extends Component {
	static propTypes = {
		isSearching: T.bool,
		searchProgress: T.number,
		searchResults: T.arrayOf(calculationResult),
		searchPolicies: T.func,
	};

	static defaultProps = {
		isSearching: false,
		searchProgress: 0,
		searchResults: [],
	};

	state = {
		firstResultLoad: true,
	};

	componentDidMount() {
		const { searchParameters } = this.props;
		if (this.props.searchPolicies) {
			this.props.searchPolicies(searchParameters);
		}

		// событие на первую прогрузку выдачи
		pushGtmEvent('VZR_SERVIS', 'download_vydacha', undefined, undefined);
	}

	componentDidUpdate(prevProps, prevState) {
		const { isSearching, searchResults, searchProgress } = this.props;
		const { firstResultLoad } = this.state;

		if (!isSearching && searchProgress > 0 && prevState.firstResultLoad === firstResultLoad && !firstResultLoad) {
			pushGtmEvent('VZR_SERVIS', 'download_vydacha_perezagruzka', undefined, undefined); // событие на пересчет выдачи
		}
	}

	get progressBar() {
		const { isSearching, searchProgress } = this.props;
		if (!isSearching) {
			return null;
		}
		return (
			<div>
				<div className="text-size-4 text-weight-bold margin-top-default margin-bottom-small">
					Подбираем вам результаты
				</div>
				<Panel
					sections={ [
						<div className="padding-medium padding-mobile-small">
							<ProgressBar now={ searchProgress } />
						</div>,
					] }
				/>
			</div>
		);
	}

	get searchResults() {
		const { isSearching, searchResults, searchProgress } = this.props;
		const { firstResultLoad } = this.state;
		if (isSearching) {
			return null;
		}

		if (searchResults && searchResults.length) {

			if (searchProgress > 0 && firstResultLoad) {
				this.setState({ firstResultLoad: false });
			}

			return (
				<SearchResultsList
					results={ searchResults }
				/>
			);
		}

		if (searchProgress > 0) {
			pushGtmEvent('VZR_SERVIS', 'not_result_calculation', undefined, undefined); // Появление страницы «По вашему расчету ничего не найдено»
		}

		return (
			<div className="padding-top-large" style={ {marginTop: -6} }>
				<NotFound />
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.progressBar}
				{this.searchResults}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isSearching: isSearchingSelector(state),
		searchParameters: searchParametersSelector(state),
		searchProgress: searchProgressSelector(state),
		searchResults: searchResultsSelector(state),
	};
}

export default connect(mapStateToProps, {
	searchPolicies,
})(SearchResults);
