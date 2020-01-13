var React = require('react');
var ResultStore = require('../stores/result-store.js');
var PopupStore = require('../stores/popup-store.js');
var Hash = require('../../../_common/utils/hash.js');
var InputMasked = require('../../../_common/react-components/fields/input-masked.jsx');
var Config = require('auto.config');
var classNames = require('classnames');
var scrollTo = require('../../../_common/utils/scroll-to.js');
import eventEmitter from '/static/bundles/ui-2013/InsuranceBundle/scripts/apps/event-emitter.js';

class PhoneWidget extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: '',
			phoneNumber: null,
			email: '',
			verificationCode: '',
			subscribe: true,
			isPhoneNumberSubmitted: false,
			isVerificationCodeSubmitted: false,
			isAgreementConfirmed: true,
			isHidden: false,
			isLoading: false,
			isVerificationCodeValid: true,
			popup: PopupStore.getPopup('agreementPopup'),
			lockedPixel: null,
			hasOffersLockedPixel: null,
			isShowMoreClicked: false,
			phoneRequire: true,
			hasEOSAGO: null
		};
		this._showAgreementPopup = this._showAgreementPopup.bind(this);
		this._onNameChange = this._onNameChange.bind(this);
		this._onPhoneNumberChange = this._onPhoneNumberChange.bind(this);
		this._onEmailChange = this._onEmailChange.bind(this);
		this._onShowMoreClick = this._onShowMoreClick.bind(this);
		this._isEmailValid = this._isEmailValid.bind(this);
		this._onVerificationCodeChange = this._onVerificationCodeChange.bind(this);
		this._onUserDataSubmit = this._onUserDataSubmit.bind(this);
		this._togglePhoneNumberForm = this._togglePhoneNumberForm.bind(this);
		this._toggleAgreementConfirmed = this._toggleAgreementConfirmed.bind(this);
		this._toggleSubscribe = this._toggleSubscribe.bind(this);
		this._onVerificationCodeSubmit = this._onVerificationCodeSubmit.bind(this);
	}

	componentDidMount() {
		let newState = {
			lockedPixel: ResultStore.getLockedPixel(),
			hasOffersLockedPixel: ResultStore.getHasOffersLockedPixel(),
			hasEOSAGO: ResultStore.getResult().result[5] !== undefined
		};

		const {user} = banki;
		if (user) {
			newState = {
				...newState,
				name: user.firstName,
				email: user.email,
				phoneNumber: user.mobile.slice(user.mobile.length - 10, user.mobile.length)
			}
		}
		this.setState(newState);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.isShowMoreClicked !== prevState.isShowMoreClicked) {
			scrollTo(this.phoneForm.offsetTop);
		}
		if (this.state.hasEOSAGO !== (ResultStore.getResult().result[5] !== undefined)) {
			this.setState({
				hasEOSAGO: ResultStore.getResult().result[5] !== undefined
			});
		}
	}

	_onNameChange(event) {
		var target = event.target;
		var value = target.value;
		var isValid = /^[A-zА-яёЁ]+[\s]?[A-zА-яёЁ]*$/.test(value);
		var validatedValue = isValid ? value : value.slice(0, -1);

		target.value = validatedValue;
		this.setState({name: validatedValue});
	}

	_onPhoneNumberChange(value) {
		this.setState({phoneNumber: value});
	}

	_onEmailChange(event) {
		this.setState({email: event.target.value});
	}

	_onShowMoreClick() {
		this.setState({isShowMoreClicked: true});
		dataLayer.push({
			event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'INS_Calculator__click_more_offers',
			eventLabel: undefined,
			eventValue: undefined
		});


	}

	_isEmailValid() {
		// I am sorry for your eyes, but regexp is ok according to https://emailregex.com/
		const ultimateEmailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const match = this.state.email.match(ultimateEmailRegexp);

		return match instanceof Array && match.length > 0 && match[0] === this.state.email;
	}

	_onVerificationCodeChange(event) {
		this.setState({
			verificationCode: event.target.value,
			isVerificationCodeValid: true
		});
	}

	_onUserDataSubmit(event) {
		var _self = this;

		event.preventDefault();

		_self.setState({isLoading: true});

		dataLayer.push({
			event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'INS_Calculator__unlock-form_submit',
			eventLabel: undefined,
			eventValue: undefined
		});

		ResultStore._submitUserData(_self.state.name.trim(), _self.state.phoneNumber, _self.state.email, _self.state.subscribe, function(result) {
			var newState = {
				verificationCode: '',
				isVerificationCodeValid: true,
				isLoading: false
			};

			if (result) {
				if (result.success) {
					newState.isPhoneNumberSubmitted = true;
					newState.isHidden = true;
				}
				newState.phoneRequire = result.phone_require && result.phone_require;
			}

			if (Config.isVerificationRequired === false || !newState.phoneRequire) {
				ResultStore._clearStorage();
				ResultStore.cancelCalculation();
				ResultStore.calculate(Hash.get(), null, null);
				ResultStore.setOpenedResultPixelVisibility(true);
			}

			_self.setState(newState, () => {
				if (_self.verificationForm) {
					!banki.env.isMobileMode && scrollTo(_self.verificationForm.offsetTop);
					banki.env.isMobileMode && scrollTo(_self.verificationForm.offsetTop - _self.verificationForm.parentElement.parentElement.offsetHeight);
				}
			});
		}, function(error) {
			_self.setState({isPhoneNumberSubmitted: false, isLoading: false});
		});
	}

	_onVerificationCodeSubmit(event) {

		event.preventDefault();

		this.setState({isLoading: true});

		dataLayer.push({
			event: 'GTM_event',
			eventCategory: 'INS_Calculator',
			eventAction: 'INS_Calculator__verification-form_submit',
			eventLabel: undefined,
			eventValue: undefined
		});

		ResultStore._submitVerificationCode(this.state.verificationCode, result => {
			const isCodeValid = (result && result.valid) ? true : false;
			const newState = {
				isLoading: false,
				isVerificationCodeValid: isCodeValid,
				isVerificationCodeSubmitted: true
			};

			if (isCodeValid) {
				ResultStore._clearStorage();
				ResultStore.cancelCalculation();
				ResultStore.calculate(Hash.get(), null, null);
				ResultStore.setOpenedResultPixelVisibility(true);
				const {name, phoneNumber, email} = this.state;
				eventEmitter.emit('insurance:e-osago-phone-verified', {name, phoneNumber, email});
			}

			this.setState(newState);
		}, error => {
			this.setState({isVerificationCodeSubmitted: false, isLoading: false});
		});
	}

	_togglePhoneNumberForm() {
		this.setState({
			isHidden: !this.state.isHidden
		}, () => {
			if (this.phoneForm) {
				scrollTo(this.phoneForm.offsetTop);
			}
		});
	}

	_toggleAgreementConfirmed() {
		this.setState({
			isAgreementConfirmed: !this.state.isAgreementConfirmed
		});
	}

	_toggleSubscribe() {
		this.setState({
			subscribe: !this.state.subscribe
		});
	}

	_showAgreementPopup(event) {
		event.preventDefault();
		this.state.popup.showPopup.apply(this.state.popup);
	}

	render() {
		var restOffersCount = this.props.resultsCount - this.props.visibleResultsCount;
		var lockedPixelItem = this.state.lockedPixel ? (
			<img src={ this.state.lockedPixel } width="1" height="1" style={ {display: 'none'} } />) : null;
		var hasOffersLockedPixelItem = this.state.hasOffersLockedPixel ? (
			<img src={ this.state.hasOffersLockedPixel } width="1" height="1" style={ {display: 'none'} } />) : null;
		var adviceList = (
			<div className="padding-default">
				<div className="font-size-medium font-bold margin-bottom-small">При необходимости консультация эксперта будет включать:</div>
				<ul className="text-list text-list--dash--blue font-size-medium">
					<li>Независимую и объективную информацию о надежности страховой компании</li>
					<li>Независимую и подробную консультацию по условиям и программам страхования</li>
					<li>Варианты экономии при страховании ТС по каско</li>
					<li>Независимый сравнительный анализ качества и скорости урегулирования убытков</li>
				</ul>
			</div>
		);
		var helpContent = (
			<div className="auto-phone__text font-size-large text-align-center padding-top-default margin-auto">
				{ !this.state.isPhoneNumberSubmitted ?
					this.state.hasEOSAGO ? `Для перехода к результатам расчетов бумажных полисов и получения бесплатной
					консультации независимого эксперта введите ваш номер телефона и e-mail.` : `Для перехода к
					результатам расчетов и получения бесплатной консультации независимого эксперта оставьте ваш номер и
					e-mail.` :
					'Введите код подтверждения, полученный по SMS.'
				}
			</div>
		);
		var phoneNumberForm = (
			<form className="grid-vert-list-default auto-form padding-default" onSubmit={ this._onUserDataSubmit } ref={ (el) => {
				this.phoneForm = el;
			} }
			>
				<div>
					<label className="font-size-medium font-bold display-block margin-bottom-x-small">Имя</label>
					<input
						type="text"
						className="form-input-field input--full-width"
						name="name"
						value={ this.state.name }
						onChange={ this._onNameChange }
					/>
				</div>
				<div>
					<label className="font-size-medium font-bold display-block margin-bottom-x-small">Телефон</label>
					<InputMasked mask="+7 (999) 999-99-99" value={ this.state.phoneNumber } onChange={ this._onPhoneNumberChange } />
				</div>
				<div>
					<label className="font-size-medium font-bold display-block margin-bottom-x-small">E-mail</label>
					<input
						type="text"
						className="form-input-field input--full-width"
						name="email"
						value={ this.state.email }
						onChange={ this._onEmailChange }
					/>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							className="modern-checkbox"
							checked={ this.state.subscribe }
							onChange={ this._toggleSubscribe }
						/>
						<span className="checkbox-label font-size-medium">
							Я соглашаюсь с &nbsp;
							<span
								className="pseudo-link"
								onClick={ this._showAgreementPopup }
								data-test="auto-rules"
							>Условиями передачи данных</span>
							&nbsp;и подтверждаю свое согласие на получение рекламных и информационных рассылок от Банки.ру на указанные мной e-mail и номер телефона
						</span>
					</label>
				</div>
				{/*<div>*/}
				{/*	<label>*/}
				{/*		<input*/}
				{/*			type="checkbox"*/}
				{/*			className="modern-checkbox"*/}
				{/*			checked={ this.state.subscribe }*/}
				{/*			onChange={ this._toggleSubscribe }*/}
				{/*		/>*/}
				{/*		<span className="checkbox-label font-size-medium">*/}
				{/*			Подтверждаю свое согласие на получение информационных писем от Банки.ру на указанный e-mail*/}
				{/*		</span>*/}
				{/*	</label>*/}
				{/*</div>*/}
				<div>
					<button
						className="button button--theme_blue input--full-width"
						type="submit"
						disabled={ !this.state.phoneNumber || !this.state.name || !this._isEmailValid() || !this.state.subscribe }
					>Отправить
					</button>
				</div>
			</form>
		);
		var verificationCodeInputClassNames = classNames('form-input-field', 'input--full-width', 'margin-right-default', {
			'input--error': !this.state.isVerificationCodeValid
		});
		var verificationCodeForm = (
			<div>
				<form
					className="auto-form grid__row"
					onSubmit={ this._onVerificationCodeSubmit }
					ref={ (el) => {
						this.verificationForm = el;
					} }
				>
					<div className="grid__cell">
						<input
							type="text"
							name="code"
							className={ verificationCodeInputClassNames }
							value={ this.state.verificationCode }
							onChange={ this._onVerificationCodeChange }
						/>
					</div>
					<div className="grid__cell grid__cell--min">
						<button
							type="submit"
							className="button button--theme_blue"
						>Подтвердить
						</button>
					</div>
				</form>
				{ !this.state.isVerificationCodeValid ?
					<div className="margin-top-x-small margin-bottom-x-small text-align-center">
						<span className="color-red">Неверный код подтверждения</span></div> : null }
				<div className="text-align-center">
					<span className="pseudo-link font-size-medium" onClick={ this._togglePhoneNumberForm }>Мне не пришло SMS сообщение</span>
				</div>
			</div>
		);
		var containerClassNames = classNames('auto-phone__container', {
			'ui-loading-overlay-big': this.state.isLoading
		});
		var showMoreButton = (
			<div className="text-align-center margin-bottom-large">
				<div className="button button--bordered" onClick={ this._onShowMoreClick }>Показать еще{ (restOffersCount > 0) ? ` ${ restOffersCount }` : '' }</div>
			</div>
		);

		return (
			<div className="margin-top-default">
				{ lockedPixelItem }
				{ hasOffersLockedPixelItem }
				{ this.props.visibleResultsCount > 0 && !this.state.isShowMoreClicked ?
					showMoreButton :
					<div className="auto-phone">
						<div className={ containerClassNames }>
							<div key="1" className="auto-phone__main padding-default">
								{ helpContent }
								{ !this.state.isPhoneNumberSubmitted ? phoneNumberForm : verificationCodeForm }
							</div>
							{ !this.state.isHidden ?
								<div key="2">
									{ !this.state.isPhoneNumberSubmitted ? adviceList : phoneNumberForm }
								</div> : null
							}
						</div>
					</div>
				}
			</div>
		);
	}
}

module.exports = PhoneWidget;
