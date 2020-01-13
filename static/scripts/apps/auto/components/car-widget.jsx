var React = require('react');
var UserStore = require('../stores/user-store.js');
var ValidationStore = require('../stores/validation-store.js');
var PopupStore = require('../stores/popup-store.js');
var Input = require('../../../_common/react-components/fields/input.jsx');
var SliderInput = require('ui.slider-input');
import { Icon } from 'react-ui';

export default class CarWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: UserStore.getData(),
			carCustomData: UserStore.getCarCustomData(),
			popup: PopupStore.getPopup('carWidgetPopup'),
			sliderInstance: null
		};
		this._initSlider = this._initSlider.bind(this);
		this._onChange = this._onChange.bind(this);
		this._update = this._update.bind(this);
		this._validate = this._validate.bind(this);
		this._submitForm = this._submitForm.bind(this);
		this._closePopup = this._closePopup.bind(this);
		this._submitForm = this._submitForm.bind(this);
		this._validateForm = this._validateForm.bind(this);
		this._componentWillMount();
	}

	_componentWillMount() {
		UserStore.addChangeListener(this._update);
	}

	componentDidMount() {
		this._initSlider();
	}

	componentWillUnmount() {
		UserStore.removeChangeListener(this._update);
	}

	_initSlider() {
		this.setState({
			sliderInstance: new SliderInput({
				container: this.refs.widgetPrice,
				segments: [{
					from: this.state.carCustomData.priceCustomMin,
					to: this.state.carCustomData.priceCustomMax,
					step: 1000
				}],
				value: this.state.carCustomData.priceCustom,
				name: 'priceCustom',
				type: 'tel',
				onChangeEnd: this._onChange.bind(this, 'priceCustom')
			})
		});
	}

	_update() {
		this.setState({
			data: UserStore.getData(),
			carCustomData: UserStore.getCarCustomData()
		});
		if (this.state.sliderInstance) {
			this.state.sliderInstance.destroy();
		}
		this._initSlider();
	}

	_validate(fieldName) {
		return ValidationStore.validateCarCustomField(fieldName, this.state.carCustomData[fieldName]);
	}

	_validateForm() {
		return ValidationStore.validateCarCustomForm(this.state.carCustomData);
	}

	_onChange(fieldName, newValue) {
		const changedCarCustomData = this.state.carCustomData;

		changedCarCustomData[fieldName] = newValue;
		this.setState({carCustomData: changedCarCustomData});
	}

	_closePopup() {
		this._update();
		this.state.popup.hidePopup.apply(this.state.popup);
	}

	_submitForm() {
		UserStore.setCarCustomData(this.state.carCustomData);
		this._closePopup();
	}

	render() {
		return (
			<div>
				<Icon name="close" size="small" clickHandler={ this._closePopup } className="ui-popup__close-icon icon-hover" />
				<div className="ui-panel-white padding-default">
					<div className="font-size-large border-bottom-solid-light margin-bottom-default padding-bottom-medium">
						<div className="header-h2 padding-right-default">Характеристики ТС, отсутствующего в списке</div>
						<p className="font-size-default">По указанным параметрам будет выполнен запрос на расчет</p>
					</div>
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Марка</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							{ this.state.data.car[0].value === null ?
								<Input
									name="brandCustom"
									classes="input--full-width"
									testAttr="auto-brandCustom"
									value={ this.state.carCustomData.brandCustom }
									required="required"
									onChange={ this._onChange }
									valid={ this._validate('brandCustom') }
									errorMessage="Марка может содержать русские или латинские буквы, пробел и дефис"
								/> :
								<input
									type="text"
									data-name="brandCustom"
									className="form-input-field input--full-width"
									data-test="auto-brandCustom"
									value={ this.state.carCustomData.brandCustom }
									disabled="disabled"
								/>
							}
						</div>
					</div>
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Модель</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							{ this.state.data.car[1].value === null ?
								<Input
									name="modelCustom"
									classes="input--full-width"
									testAttr="auto-modelCustom"
									value={ this.state.carCustomData.modelCustom }
									required="required"
									onChange={ this._onChange }
									valid={ this._validate('modelCustom') }
									errorMessage="Модель может содержать русские или латинские буквы, цифры, пробел и дефис"
								/> :
								<input
									type="text"
									data-name="modelCustom"
									className="form-input-field input--full-width"
									data-test="auto-modelCustom"
									value={ this.state.carCustomData.modelCustom }
									disabled="disabled"
								/>
							}
						</div>
					</div>
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Год выпуска</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							{ this.state.data.car[2].value === null ?
								<Input
									type="number"
									name="yearCustom"
									classes="input--full-width"
									testAttr="auto-yearCustom"
									value={ this.state.carCustomData.yearCustom }
									required="required"
									onChange={ this._onChange }
									valid={ this._validate('yearCustom') }
									errorMessage="Год может содержать только цифры в формате ГГГГ, начиная с 1936 г."
								/> :
								<input
									type="text"
									data-name="yearCustom"
									className="form-input-field input--full-width"
									data-test="auto-yearCustom"
									value={ this.state.carCustomData.yearCustom }
									disabled="disabled"
								/>
							}
						</div>
					</div>
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Мощность, л.с.</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							{ this.state.data.car[4].value === null ?
								<Input
									type="number"
									name="powerCustom"
									classes="input--full-width"
									testAttr="auto-powerCustom"
									value={ this.state.carCustomData.powerCustom }
									required="required"
									onChange={ this._onChange }
									valid={ this._validate('powerCustom') }
									errorMessage="Мощность может содержать только цифры, значение в диапазоне от 10 до 10 000 л.с."
								/> :
								<input
									type="text"
									data-name="powerCustom"
									className="form-input-field input--full-width"
									data-test="auto-powerCustom"
									value={ this.state.carCustomData.powerCustom }
									disabled="disabled"
								/>
							}
						</div>
					</div>
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Модификация</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							{ this.state.data.car[3].value === null ?
								<Input
									name="modificationCustom"
									classes="input--full-width"
									testAttr="auto-modificationCustom"
									value={ this.state.carCustomData.modificationCustom }
									required="required"
									onChange={ this._onChange }
									valid={ this._validate('modificationCustom') }
									errorMessage="Поле не может быть пустым"
								/> :
								<input
									type="text"
									data-name="modificationCustom"
									className="form-input-field input--full-width"
									data-test="auto-modificationCustom"
									value={ this.state.carCustomData.modificationCustom }
									disabled="disabled"
								/>
							}
							<p className="font-size-small color-gray-gray">Тип кузова, тип двигателя, коробка передач</p>
						</div>
					</div>
					<div className="grid__row">
						<div key="title" className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Стоимость, ₽</div>
						<div key="widget" className="grid__cell grid__cell--12 grid__cell--sm-8" ref="widgetPrice"></div>
					</div>
				</div>
				<div className="ui-panel-gray padding-default is-center">
					<button
						type="submit"
						className="button button--theme_blue"
						onClick={ this._submitForm }
						disabled={ !this._validateForm() }
						data-test="auto-submitCustom"
					>сохранить и рассчитать</button>
				</div>
			</div>
		);
	}
}
