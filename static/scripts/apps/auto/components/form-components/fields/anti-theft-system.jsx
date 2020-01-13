var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var DataStore = require('../../../stores/data-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = DataStore.getAntiTheftSystemsList();
		this.state = {items: items}
		this._update = this._update.bind(this)
		this._componentWillMount()
	}

	_componentWillMount() {
		DataStore.addReceiveDataListener(this._update);
	}

	componentWillUnmount() {
		DataStore.removeReceiveDataListener(this._update);
	}

	_update() {
		var items = DataStore.getAntiTheftSystemsList();

		this.setState({items: items});
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'anti_theft_system',
			data: value
		});

		AppDispatcher.dispatch({
			action: 'UPDATE_ANTI_THEFT_SYSTEMS_LIST',
			value: value
		});
	}

	render() {
		var self = this;

		if (this.props.data.type.kasko && this.props.data.has_anti_theft_system) {
			ValidationStore.setField(['anti_theft_system']);
			ValidationStore.validateField(this.props.data, 'anti_theft_system');

			return (
				<div className="grid__row grid__row--align-center" data-hint="anti_theft_system">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Наименование ПУС</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						{ this.state.items.length ?
							<Select
								items={ this.state.items }
								custom={ true }
								onChange={ this._onChange }
								value={ this.props.data.anti_theft_system }
								optionsExtended={ {
									filter: '',
									togglerText: 'Выберите ПУС',
									items: this.state.items,
									onInit: function(instance) {
										instance.selectItem(self.props.data.anti_theft_system);
									}
								} }
							/> : <span className="ui-loader-icon"></span>
						}
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
