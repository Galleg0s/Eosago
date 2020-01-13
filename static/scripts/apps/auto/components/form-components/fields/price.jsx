var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var ValidationStore = require('../../../stores/validation-store.js');
var SliderInput = require('ui.slider-input');
var $ = require('jquery');

module.exports = class extends React.Component {
	componentDidMount() {
		this._initSlider();
	}

	componentDidUpdate() {
		this._initSlider();
	}

	_initSlider() {
		if (this.refs.price) {
			var price = $(this.refs.price);
			var self = this;

			if (!price.data('sliderInstance')) {
				price.data('sliderInstance', new SliderInput({
					container: self.refs.price,
					segments: [{
						from: self.props.data.cost_min,
						to: self.props.data.cost_max,
						step: 1000
					}],
					value: this.props.data.price,
					name: 'price',
					type: 'tel',
					onChangeEnd: self._onChange.bind(this, 'price')
				}))
			}
		}
	}

	_onChange(name, value) {
		if (this.props.data.price === value) {return;}

		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: name,
			data: value
		});
	}

	render() {
		ValidationStore.setField(['price']);

		if (this.props.data.type.kasko) {
			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Примерная стоимость автомобиля</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<div className="grid__row grid__row--v-zero grid__row--align-center">
							<div ref="price" className="grid__cell" data-test="auto-price" style={ {height: '40px'} }></div>
							<div className="grid__cell grid__cell--min font-size-large">₽</div>
						</div>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
