import React, { Component } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { getPluralForm } from 'helpers';
import {
	Icon,
	IconButton,
	ExpansionPanel,
	Panel,
	Tooltip,
	Link,
	SearchResultsList as SearchResults,
	GridWrapper,
	GridRow,
	GridCol,
} from 'react-ui-2018';
import SearchListItem from '../SearchListItem/SearchListItem';
import { calculationResult } from '../../types';
import s from './SearchResults.module.styl';
import { applyContainerQuery } from 'react-container-query';

const getParentItem = group => {
	if (group && group.length) {
		return group.reduce((p, v) => p.totalSum < v.totalSum ? p : v);
	}
	return null;
};

class SearchResultsList extends Component {
	static propTypes = {
		results: T.arrayOf(calculationResult),
		containerQuery: T.shape({
			/** Ширина контейнера до 503px */
			xs: T.bool,
			/** Ширина контейнера от 504px до 703px */
			sm: T.bool,
			/** Ширина от 704px и выше */
			md: T.bool
		})
	};

	static defaultProps = {
		results: [],
		containerQuery: {
			lg: false,
			md: false,
			sm: false,
			xs: false,
		},
	};

	get sections() {
		const { results } = this.props;
		if (!results) {
			return null;
		}
		return results.map((group, idx) => {
			return (
				<SearchListItem
					key={ idx }
					result={ group }
				/>
			);
		});
	}

	// Количество найденных полисов
	get resultsCount() {
		const { results } = this.props;
		if (results) {
			return results.length;
		}
		return 0;
	}

	get optionsTooltip() {
		return (
			<div className="text-size-6">
				Опции &mdash; это включенные в полис
				<br />
				страховые риски.
			</div>
		);
	}

	get header() {
		const { containerQuery } = this.props;
		if (containerQuery.md) {
			return (
				<div className="margin-bottom-small padding-left-default padding-right-default">
					<GridRow>
						<GridCol xs={ 1 } sm={ 3 } md={ 4 } lg={ 4 } xl={ 6 } xsAlign="baseline">
							<h4 className="text-size-4 text-weight-bold" style={ {marginLeft: -32} }>
								Найдено { getPluralForm(this.resultsCount, ['полис', 'полиса', 'полисов']) }
							</h4>
						</GridCol>
						<GridCol xs={ 1 } sm={ 2 } md={ 3 } lg={ 3 } xl={ 3 } xsAlign="baseline">
							<div className="text-size-6 color-minor-black-lighten">
								Стоимость полиса
							</div>
						</GridCol>
						<GridCol xs={ 2 } sm={ 3 } md={ 5 } lg={ 5 } xl={ 2 } xsAlign="baseline">
							<div className="text-size-6 color-minor-black-lighten">
								Опции
								<Tooltip
									content={ this.optionsTooltip }
									position="top"
									trigger="mouseenter"
								>
									<span className={ cx(s.optionsIcon, 'margin-left-x-small') }>
										<IconButton icon="info" size="medium" />
									</span>
								</Tooltip>
							</div>
						</GridCol>
					</GridRow>
				</div>
			);
		} else if (containerQuery.sm || containerQuery.xs) {
			return (
				<div className="margin-bottom-small padding-left-default padding-right-default">
					<GridRow>
						<GridCol xs={ 12 } sm={ 12 } xsAlign="baseline">
							<h4 className="text-size-4 text-weight-bold" style={ {marginLeft: -8} }>
								Найдено { getPluralForm(this.resultsCount, ['полис', 'полиса', 'полисов']) }
							</h4>
						</GridCol>
					</GridRow>
				</div>
			);
		}
	}

	get items() {
		const { results, containerQuery } = this.props;
		return results.map(item => {
			return (
				<SearchListItem
					key={ item.id }
					result={ item }
					containerQuery={ containerQuery }
					isParent
				/>
			);
		});
	}

	render() {

		return (
			<div>
				{this.header}
				<SearchResults>
					{this.items}
				</SearchResults>
			</div>
		);
	}
}

const query = {
	md: {
		minWidth: 704,
	},
	sm: {
		maxWidth: 703,
		minWidth: 504,
	},
	xs: {
		maxWidth: 503,
	},
};

export default applyContainerQuery(SearchResultsList, query);
