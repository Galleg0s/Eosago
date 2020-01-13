var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this._onChange = this._onChange.bind(this)
	}
	_onChange() {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'is_credit_car',
			data: !this.props.data.is_credit_car
		});
	}

	render() {
		if (this.props.data.type.kasko) {
			ValidationStore.setField(['is_credit_car']);

			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Автомобиль взят в кредит</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8 field-text">
						<label className="title-checkbox">
							<input
								type="checkbox"
								className="modern-checkbox"
								onChange={ this._onChange }
								checked={ this.props.data.is_credit_car }
							/>
							<span className="checkbox-label">да</span>
						</label>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
