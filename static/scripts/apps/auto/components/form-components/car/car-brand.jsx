import React from 'react';
import AppDispatcher from '../../../dispatcher/dispatcher.js';
import CarStore from '../../../stores/car-store.js';
import PopupStore from '../../../stores/popup-store.js';
import AlhabetColumns from '../../../../../_common/utils/alphabet-columns.js';
import $ from 'jquery';
import scrollTo from '../../../../../_common/utils/scroll-to.js';

const COLUMN_COUNT = 4;

export default class CarBrand extends React.Component {
	constructor(props) {
		super(props);
		this._showPopup = this._showPopup.bind(this);
		this._showMoreBrands = this._showMoreBrands.bind(this);
		var brandsList = CarStore.getCarBrands();
		var brands = this._regroupBrands(brandsList, true);

		this.state = {
			initialBrandList: brandsList,
			brands: brands,
			isShortList: true,
			popup: PopupStore.getPopup('carWidgetPopup')
		};
	}

	_regroupBrands(list, onlyPopular) {
		var newList = null;

		if (onlyPopular) {
			newList = [];

			list.forEach(function(item) {
				if (item.is_popular) {
					newList.push(item);
				}
			});
		} else {
			newList = list;
		}

		return AlhabetColumns.build(newList, COLUMN_COUNT);
	}

	_showMoreBrands() {
		var brands = this._regroupBrands(this.state.initialBrandList, false);
		this.setState({
			brands: brands,
			isShortList: false
		});
	}

	_selectBrand(brand) {
		AppDispatcher.dispatch({
			action: 'SELECT_CAR_PROPERTY',
			code: 'brand',
			data: brand
		});

		dataLayer.push({ event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'INS_Calculator__car_brand',
			eventLabel: brand.title,
			eventValue: undefined
		});

		this._scrollToForm();
	}

	_showPopup() {
		var $currentField = this.state.popup.$container.find('[data-name="brandCustom"]');

		if ($currentField.length) {
			$currentField.addClass('focused');
			setTimeout(function() {
				$currentField.removeClass('focused');
			}, 3000);
		}
		this.state.popup.showPopup.apply(this.state.popup);
	}

	_scrollTo($element) {
		setTimeout(function() {
			if ($element && $element.offset() && $element.offset().top > 100) {
				scrollTo($element.offset().top - 100);
			}
		}, 100);
	}

	_scrollToForm() {
		var $element = $('#react-auto-form');

		this._scrollTo($element);
	}

	render() {
		var self = this;

		var brands = this.state.brands.map(function(column, index) {
			var letterList = column.map(function(letter) {
				var brandList = letter.list.map(function(brand) {
					return (
						<li className="margin-top-x-small margin-bottom-small" key={ brand.title }>
							<span
								className="pseudo-link"
								onClick={ self._selectBrand.bind(self, brand) }
							>{ brand.title }</span>
						</li>
					)
				});
				return (
					<ul className="car-column-list" data-letter={ letter.title } key={ letter.title }>{ brandList }</ul>
				)
			});
			return (
				<div className="grid__cell grid__cell--12 grid__cell--sm-6" key={ index }>{ letterList }</div>
			)
		});

		var more = (
			<div className="grid__cell grid__cell--v-zero text-align-right">
				<span
					className="pseudo-link"
					onClick={ this.state.isShortList ? this._showMoreBrands : this._showPopup }
				>
					{ this.state.isShortList ? 'Все марки' : 'Другая марка' }
				</span>
			</div>
		);

		return (
			<div data-test="auto-brand-select">
				<div className="grid__row">
					<div className="grid__cell grid__cell--6">
						<div className="grid__row">
							{ brands.slice(0, COLUMN_COUNT / 2) }
						</div>
					</div>
					<div className="grid__cell grid__cell--6">
						<div className="grid__row">
							{ brands.slice(COLUMN_COUNT / 2, COLUMN_COUNT) }
						</div>
					</div>
				</div>
				<div className="grid__row padding-top-default padding-bottom-x-small">
					{ more }
				</div>
			</div>
		)
	}
}
