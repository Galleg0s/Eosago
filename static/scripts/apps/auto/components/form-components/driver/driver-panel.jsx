var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Kasko = require('./kasko-panel.jsx');
var Osago = require('./osago-panel.jsx');
var KaskoOsago = require('./kasko-osago-panel.jsx');
var Owner = require('./owner.jsx');
import { Icon } from 'react-ui';

class AutoFormDriverPanel extends React.Component {
	constructor(props) {
		super(props);
		var driverCount = FormStore.getDriverCount();
		var driverValidationList = this._getDriverValidation(this.props.data);
		this.state = {
			driverCount: driverCount,
			driverValidationList: driverValidationList
		}
	}

	componentWillReceiveProps(nextProps) {
		var driverValidationList = this._getDriverValidation(nextProps.data);
		this.setState({driverValidationList: driverValidationList});
	}

	_getDriverValidation(data) {
		return data.drivers.map(function(driver, index) {
			return ValidationStore.validateDriver(data, index);
		});
	}

	_addDriver() {
		AppDispatcher.dispatch({
			action: 'ADD_DRIVER'
		});
	}

	_deleteDriver(index) {
		AppDispatcher.dispatch({
			action: 'DELETE_DRIVER',
			index: index
		});
	}

	_change(index, name, value) {
		// todo: remove ugly fix with this two fields
		var fieldNamesToFix = ['children', 'marriage'];

		if (fieldNamesToFix.indexOf(name) !== -1) {
			value = value === 'true';
		}

		AppDispatcher.dispatch({
			action: 'UPDATE_DRIVER',
			index: index,
			field: name.split('.'),
			value: value
		});
	}

	render() {
		var self = this;

		function driverList() {
			return self.props.data.drivers.map(function(driver, index) {
				var kaskoOrOsago = self.props.data.type.kasko ? (
					<Kasko
						driver={ driver }
						driverIndex={ index }
						validation={ self.state.driverValidationList[index] }
						onChange={ self._change.bind(self, index) }
					/>
					) : (
					<Osago
						driver={ driver }
						driverIndex={ index }
						validation={ self.state.driverValidationList[index] }
						onChange={ self._change.bind(self, index) }
					/>
				);

				return (
					<div className="padding-default" key={ index }>
						<div className="grid__row">
							{ self.state.driverValidationList[index].valid && <div className="grid__cell grid__cell--min"><Icon name="checkmark-circled" size="small" className="color-turquoise" /></div> }
							<div className="grid__cell font-bold">{ self.state.driverCount[index] } водитель</div>
							{ self.props.data.drivers.length > 1 &&
								<div className="grid__cell grid__cell--min">
									<Icon
										name="close"
										color="red"
										size="small"
										clickHandler={ self._deleteDriver.bind(self, index) }
										className="icon-hover"
									/>
								</div>
							}
						</div>
						<div className="border-bottom-dotted padding-top-default"></div>
						{ self.props.data.accident_free && self.props.data.type.osago ?
							<KaskoOsago
								driver={ driver }
								driverIndex={ index }
								type={ self.props.data.type }
								validation={ self.state.driverValidationList[index] }
								onChange={ self._change.bind(self, index) }
							/> : kaskoOrOsago
						}
					</div>
				)
			});
		}

		if (this.props.data.multidrive && !this.props.data.accident_free ||
			!this.props.data.type.osago && this.props.data.multidrive && this.props.data.accident_free) {
			return null;
		} else {
			return (
				<div>
					<div className="ui-panel-white-shadow" id="react-auto-drivers">
						{ this.props.data.multidrive && this.props.data.accident_free ?
							<Owner
								driver={ this.props.data.drivers[0] }
								driverIndex={ 0 }
								validation={ self.state.driverValidationList[0] }
								onChange={ self._change.bind(self, 0) }
							/> :
							<div>
								{ driverList() }
							</div>
						}
					</div>

					{ this.props.data.drivers.length < 10 && !(this.props.data.multidrive && this.props.data.accident_free) &&
						<div onClick={ this._addDriver } className="margin-top-default">
							<Icon name="add" size="small" className="icon-hover margin-right-x-small" />
							<span className="pseudo-link">Добавить водителя</span>
						</div>
					}
				</div>
			)
		}
	}
}

module.exports = AutoFormDriverPanel;
