import React from 'react';
import AppDispatcher from '../../../dispatcher/dispatcher.js';
import CarStore from '../../../stores/car-store.js';
import PopupStore from '../../../stores/popup-store.js';
import { Input } from 'react-ui';

export default class CarProperty extends React.Component {

	state = {
		code: this.props.code,
		items: CarStore.getItems(),
		popup: PopupStore.getPopup('carWidgetPopup'),
		linkTitles: {
			year: 'Другой год',
			model: 'Другая модель',
			modification: 'Другая модификация',
		},
		modificationQuery: '',
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.code !== nextProps.code) {
			const items = CarStore.getItems();
			this.setState({
				code: nextProps.code,
				items: items,
				modificationQuery: '',
			});
		}
	}

	componentDidMount() {
		CarStore.addRecieveDataListener(this._update);
	}

	componentWillUnmount() {
		CarStore.removeRecieveDataListener(this._update);
	}

	_update = () => {
		const items = CarStore.getItems();
		if (items && items.length) {
			this.setState({items: items, modificationQuery: ''});
		}
	};

	_select = item => () => {
		AppDispatcher.dispatch({
			action: 'SELECT_CAR_PROPERTY',
			code: this.state.code,
			data: item
		});

		if (this.state.code === 'modification') {
			AppDispatcher.dispatch({
				action: 'SET_CAR_COST'
			});
		}

		dataLayer.push({ event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: `INS_Calculator__car_${this.state.code}`,
			eventLabel: item.title,
			eventValue: undefined
		});
	};

	_showPopup = () => {
		const $currentField = this.state.popup.$container.find('[data-name="' + this.state.code + 'Custom"]');

		if ($currentField.length) {
			$currentField.addClass('focused');
			setTimeout(function() {
				$currentField.removeClass('focused');
			}, 3000);
		}
		this.state.popup.showPopup.apply(this.state.popup);
	};

	_queryChangeHandler = modificationQuery => {
		this.setState({
			modificationQuery,
		});
	};

	get filterField() {
		if ((!this.state.items || !this.state.items.length) || this.state.code !== 'modification') {
			return null;
		}

		return (
			<div className="grid__cell grid__cell--12">
				<Input
					value={ this.state.modificationQuery }
					changeHandler={ this._queryChangeHandler }
				/>
			</div>
		);
	}

	get content() {
		if (this.state.items && this.state.items.length) {
			const items = this.state.modificationQuery && this.state.modificationQuery.length >= 2 ?
				this.state.items.filter(item => item.title && item.title.toUpperCase().includes(this.state.modificationQuery.toUpperCase()))
				: this.state.items;

			return items.map(item => {
				return (
					<div className="grid__cell grid__cell--min">
						<span
							key={ item.id }
							className="pseudo-link"
							onClick={ this._select(item) }
						>{ item.title }</span>
					</div>
				)
			});
		}
		return (
			<div className="grid__cell is-center">
				<div className="ui-loader-icon"></div>
			</div>
		);
	}

	get popupLink() {
		return this.state.items && this.state.items.length && this.state.code !== 'mileage' ? (
			<div className="grid__cell grid__cell--min">
				<span className="pseudo-link" onClick={ this._showPopup }>{ this.state.linkTitles[this.state.code] }</span>
			</div>
		) : null;
	}

	render() {
		return (
			<div data-test={ `auto-${this.state.code}-select` }>
				<div className="grid__row grid__row--v-sm grid__row--h-md">
					{ this.filterField }
					{ this.content }
					{ this.popupLink }
				</div>
			</div>
		)
	}
}
