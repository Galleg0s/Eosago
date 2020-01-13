var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../dispatcher/dispatcher.js');
var UserStore = require('../stores/user-store.js');
var FormStore = require('../stores/form-store.js');
var ResultStore = require('../stores/result-store.js');
var ValidationStore = require('../stores/validation-store.js');
var PreviousCalculationPopover = require('./form-components/previous-calculation-popover.jsx');
var RegionPopover = require('./form-components/region-popover.jsx');
import Car from './form-components/car/car.jsx';
var Fields = require('./form-components/fields.jsx');
var Drivers = require('./form-components/drivers.jsx');
var DriverPanel = require('./form-components/driver/driver-panel.jsx');
var Submit = require('./form-components/submit.jsx');
var Tooltip = require('ui.tooltip');
var Helpers = require('helpers');
var find = require('lodash/find');
var forEach = require('lodash/forEach');
import { AlertPanel } from 'react-ui';
import AboutEOSAGOPopup from './about-eosago-popup.jsx';

class AutoForm extends React.Component {
	constructor(props) {
		super(props);

		const formData = UserStore.getData();
		const isCarSelected = this._checkCarSelection(formData);
		const isRegionSelected = UserStore.checkCookiesField('region');
		const isRegionRegistrationSelected = UserStore.checkCookiesField('region_registration');
		const insuranceTypes = FormStore.getInsuranceTypes();
		const typeTooltip = FormStore.getTypeTooltips();
		const saveEnabled = ResultStore.getSaveEnabled();
		const hasCalculationId = ResultStore.hasCalculationId();
		const hasSavedResult = ResultStore.hasResultInStorage();

		this.state = {
			orderData: formData,
			isCarSelected: isCarSelected,
			isRegionSelected: isRegionSelected,
			isRegionRegistrationSelected: isRegionRegistrationSelected,
			insuranceTypes: insuranceTypes,
			typeTooltip: typeTooltip,
			saveEnabled: saveEnabled,
			showPreviousCalculationPopover: !hasCalculationId && hasSavedResult,
			isOSAGOAlertVisible: true,
			isEOSAGOPopupVisible: false
		};

		this._update = this._update.bind(this);
		this._checkCarSelection = this._checkCarSelection.bind(this);
		this._toggleOrderType = this._toggleOrderType.bind(this);
		this._toggleSaveEnabled = this._toggleSaveEnabled.bind(this);
		this.onConfirmPreviousCalculation = this.onConfirmPreviousCalculation.bind(this);
		this.onCancelPreviousCalculation = this.onCancelPreviousCalculation.bind(this);
		this.closeESAGOAlert = this.closeESAGOAlert.bind(this);
		this.showEOSAGOPopup = this.showEOSAGOPopup.bind(this);
		this.closeESAGOPopup = this.closeESAGOPopup.bind(this);
		this._componentWillMount()
	}

	_componentWillMount() {
		UserStore.addChangeListener(this._update);
		ResultStore.addUpdateListener(this._update);
	}

	componentWillUnmount() {
		UserStore.removeChangeListener(this._update);
		ResultStore.removeUpdateListener(this._update);
	}

	componentDidMount() {
		const currentDate = new window.Date();
		const defaultDateArray = [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate() + 3];

		if (!(this.state.orderData.region.id === null && !this.state.isRegionSelected)) {
			if (this.state.orderData.region.id === null) {
				UserStore.fillData({
					region: UserStore.getCookiesField('region'),
					region_registration: UserStore.getCookiesField('region_registration')
				});
			}

			if (this.state.orderData.region_registration.id === null) {
				UserStore.fillData({
					region_registration: this.state.orderData.region
				});
			}

			if (!this.state.isRegionSelected) {
				UserStore.setCookies(['region', 'region_registration']);
			}
		}

		// todo: move default value to store or something
		if (this.state.orderData.policy_start_date === null) {
			UserStore.setField('policy_start_date', Helpers.formatLocalDateToString.apply(Helpers, defaultDateArray));
		}

		// todo: move default value to store or something
		if (this.state.orderData.car[1].id !== null && this.state.orderData.car_used_since === null) {
			UserStore.setField('car_used_since', Helpers.formatLocalDateToString(parseInt(this.state.orderData.car[1].value), defaultDateArray[1], defaultDateArray[2]));
		}

		if (this.state.orderData.anti_theft_system !== -1) {
			UserStore.fillData({
				has_anti_theft_system: true
			});
		}

		this._initTooltips();
	}

	_checkCarSelection(data) {
		return data.is_custom_car || !find(data.car, {id: null});
	}

	_update() {
		const formData = UserStore.getData();
		const isCarSelected = this._checkCarSelection(formData);
		const isRegionSelected = UserStore.checkCookiesField('region');
		const isRegionRegistrationSelected = UserStore.checkCookiesField('region_registration');
		const saveEnabled = ResultStore.getSaveEnabled();

		this.setState({
			orderData: formData,
			isCarSelected: isCarSelected,
			isRegionSelected: isRegionSelected,
			isRegionRegistrationSelected: isRegionRegistrationSelected,
			saveEnabled: saveEnabled
		});
	}

	_toggleOrderType(type) {
		return () => {
			AppDispatcher.dispatch({
				action: 'TOGGLE_ORDER_TYPE',
				type: type
			});
		};
	}

	_toggleSaveEnabled() {
		AppDispatcher.dispatch({
			action: 'TOGGLE_SAVE_ENABLED'
		});
	}

	_initTooltips() {
		const tooltips = ReactDOM.findDOMNode(this).querySelectorAll('*[data-tooltip]');

		forEach(tooltips, function(item) {
			new Tooltip($(item), {
				placement: 'bottom',
				content: item.getAttribute('data-content')
			});

			item.removeAttribute('data-tooltip');
		});
	}

	onConfirmPreviousCalculation() {
		ResultStore.loadLastResult();

		this.setState({
			showPreviousCalculationPopover: false
		});
	}

	onCancelPreviousCalculation() {
		this.setState({
			showPreviousCalculationPopover: false
		});
	}

	closeESAGOAlert() {
		this.setState({
			isOSAGOAlertVisible: false
		});
	}

	showEOSAGOPopup() {
		this.setState({
			isEOSAGOPopupVisible: true
		});
	}

	closeESAGOPopup() {
		this.setState({
			isEOSAGOPopupVisible: false
		});
	}

	render() {

		ValidationStore.clearFields();

		return (
			<div className="bg-gray">
				<div className="padding-default">
					<header className="font-size-large">Рассчитать стоимость полиса</header>

					<hr className="hor-content-separator hor-content-separator--dark" />

					<div className="grid-vert-list-default">
						<div className="inline-elements inline-elements--large">
							<div>
								<label className="title-checkbox">
									<input
										type="checkbox"
										className="modern-checkbox"
										onChange={ this._toggleOrderType('kasko') }
										checked={ this.state.orderData.type.kasko }
									/>
									<span className="checkbox-label font-bold font-size-medium text-uppercase">каско</span>
								</label>

								<span className="margin-left-x-small">
									<i className="icon-font icon-hover icon-question-16" data-tooltip data-content={ this.state.typeTooltip.kasko } />
								</span>
							</div>

							<div>
								<label className="title-checkbox">
									<input
										type="checkbox"
										className="modern-checkbox"
										onChange={ this._toggleOrderType('osago') }
										checked={ this.state.orderData.type.osago }
									/>
									<span className="checkbox-label font-bold font-size-medium text-uppercase">осаго</span>
								</label>
								<span className="margin-left-x-small">
									<i className="icon-font icon-hover icon-question-16" data-tooltip data-content={ this.state.typeTooltip.osago } />
								</span>
							</div>
						</div>

						{ this.state.orderData.type.osago && !this.state.orderData.type.kasko && this.state.isOSAGOAlertVisible &&
							<noindex>
								<div className="margin-top-default margin-bottom-default">
									<AlertPanel theme="info" closeHandler={ this.closeESAGOAlert }>
										<span>Можно оформить как бумажный, так и{' '}</span>
										<span
											className="pseudo-link font-bold"
											onClick={ this.showEOSAGOPopup }
											data-test="auto-rules"
										>
											электронный полис ОСАГО
										</span>
										<span>{' '}(е-ОСАГО)</span>
									</AlertPanel>
								</div>
							</noindex>
						}

						{ this.state.orderData.type.kasko || this.state.orderData.type.osago ?
							<div className="grid-vert-list-default">
								<Car data={ this.state.orderData } />

								{ this.state.isCarSelected &&
									<div>
										{ !(!this.state.orderData.type.kasko && !this.state.orderData.type.osago) &&
											<header>
												<div className="font-size-large">
													Описание автомобиля
												</div>

												<hr className="hor-content-separator hor-content-separator--dark" />
											</header>
										}

										<Fields data={ this.state.orderData } />
									</div>
								}

								{ this.state.isCarSelected &&
									<div>
										<div className="font-size-large">
											Информация о водителях и параметры страховки
										</div>

										<hr className="hor-content-separator hor-content-separator--dark" />

										<Drivers data={ this.state.orderData } />
									</div>
								}

								{ this.state.isCarSelected && <DriverPanel data={ this.state.orderData } /> }
							</div> :
							<div className="margin-top-default margin-bottom-default">
								<AlertPanel
									theme="warning"
								>
									<span>Пожалуйста, выберите вид страхования</span>
								</AlertPanel>
							</div>
						}
					</div>
				</div>

				{ (this.state.orderData.type.kasko || this.state.orderData.type.osago) && this.state.isCarSelected &&
					<Submit
						data={ this.state.orderData }
						saveEnabled={ this.state.saveEnabled }
						onSaveEnableClick={ this._toggleSaveEnabled }
					/>
				}

				{ this.state.showPreviousCalculationPopover &&
					<PreviousCalculationPopover
						onConfirm={ this.onConfirmPreviousCalculation }
						onCancel={ this.onCancelPreviousCalculation }
					/>
				}

				{ !this.state.showPreviousCalculationPopover && this.state.orderData.region.id === null && !this.state.isRegionSelected &&
					<RegionPopover />
				}

				<AboutEOSAGOPopup isOpen={ this.state.isEOSAGOPopupVisible } closeHandler={ this.closeESAGOPopup } />
			</div>
		)
	}
}

export default AutoForm;
