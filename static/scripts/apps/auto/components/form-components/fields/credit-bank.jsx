var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var DataStore = require('../../../stores/data-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = DataStore.getBanksList();
		this.state = {items: items};
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
		var items = DataStore.getBanksList();

		this.setState({items: items});
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'credit_bank',
			data: value
		});

		AppDispatcher.dispatch({
			action: 'UPDATE_BANK_LIST',
			value: value
		});
	}

	render() {
		var self = this;

		if (this.props.data.type.kasko && this.props.data.is_credit_car) {
			ValidationStore.setField(['credit_bank']);
			ValidationStore.validateField(this.props.data, 'credit_bank');

			return (
				<div className="grid__row grid__row--align-center" data-hint="credit_bank">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Банк</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						{ this.state.items.length ?
							<Select
								items={ this.state.items }
								custom={ true }
								onChange={ this._onChange }
								value={ this.props.data.credit_bank }
								optionsExtended={ {
									filter: '',
									togglerText: 'Выберите банк',
									items: this.state.items,
									bottomList: [{name: 'Другой банк', id: 0, selected: (this.props.data.credit_bank === 0)}],
									onInit: function(instance) {
										instance.selectItem(self.props.data.credit_bank);
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
