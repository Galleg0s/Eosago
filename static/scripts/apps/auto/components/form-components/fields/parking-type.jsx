var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = FormStore.getParkingTypes();
		this.state = {items: items};
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'parking_type',
			data: value
		});
	}

	render() {
		if (this.props.data.type.kasko) {
			ValidationStore.setField(['parking_type']);

			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Стоянка в ночное время</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="parking-type">
						<Select
							items={ this.state.items }
							value={ this.props.data.parking_type }
							name="parkingType"
							onChange={ this._onChange }
						/>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
