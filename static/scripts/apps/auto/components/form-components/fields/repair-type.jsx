var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = FormStore.getRepairTypes();
		this.state = {items: items}
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'repair_type',
			data: value
		});
	}

	render() {
		if (this.props.data.type.kasko) {
			var self = this;

			ValidationStore.setField(['repair_type']);

			return (
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Направление на ремонт</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="repair-type">
						<Select
							items={ this.state.items }
							value={ this.props.data.repair_type }
							name="repairType"
							onChange={ this._onChange }
							optionsExtended={ {
								onInit(instance) {
									instance.selectItem(self.props.data.repair_type);
								}
							} }
						/>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
