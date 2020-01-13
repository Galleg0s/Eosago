var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = FormStore.getPeriods();
		this.state = {items: items}
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'period',
			data: parseInt(value)
		});
	}

	render() {
		if (this.props.data.type.osago) {
			ValidationStore.setField(['period']);

			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Период использования</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="auto-period">
						<Select
							items={ this.state.items }
							onChange={ this._onChange }
							value={ this.props.data.period }
						/>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
