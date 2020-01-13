import { Icon } from 'react-ui';
var React = require('react');
var UserStore = require('../stores/user-store.js');
var classNames = require('classnames');

var REGULAR = 'regular';
var ONLINE = 'online';
var cards = {
	send_request: {
		title: 'Подайте заявку',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/send-green.svg')
	},
	send_request_osago: {
		title: 'Выберите подходящее предложение',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/send-green.svg')
	},
	specialist_call: {
		title: 'Оформите полис совместно с нашим специалистом',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/specialist-call-green.svg')
	},
	email_send: {
		title: 'Перешлите копии документов на почту',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/email-send-green.svg')
	},
	messages: {
		title: 'Перешлите копии документов на почту или в Viber или WhatsApp на номер +7\u00a0925\u00a0803-02-02',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/messages-green.svg')
	},
	messages_fast: {
		title: 'Перешлите фотографии документа на автомобиль и водительского удостоверения в Viber или WhatsApp на номер +7\u00a0925\u00a0803-02-02',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/messages-green.svg')
	},
	card_pay: {
		title: 'Оплатите полис картой',
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/card-pay-green.svg')
	},
	email_polis: {
		title: ['Получите полис на ', <br />, 'e-mail'],
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/email-polis-green.svg')
	},
	doc_hand: {
		title: ['Получите полис ', <br />, 'у курьера или в офисе'],
		image: require('../../../../../../../../../htdocs/static/common/images/100x100/doc-hand-green.svg')
	}
};
var titles = {};
titles[REGULAR] = 'Покупка полиса на Банки.ру — это просто';
titles[ONLINE] = 'Покупка полиса на Банки.ру — это просто';

var sets = {
	set1: {
		type: REGULAR,
		items: ['send_request', 'specialist_call', 'doc_hand']
	},
	set2: {
		type: REGULAR,
		items: ['messages_fast', 'doc_hand']
	},
	set3: {
		type: ONLINE,
		items: ['send_request_osago', 'card_pay', 'email_polis']
	},
	set4: {
		type: REGULAR,
		items: ['send_request', 'specialist_call', 'email_send', 'doc_hand']
	}
};
var typeSwitcherButtons = [
	{
		title: 'Бумажный полис',
		type: REGULAR
	},
	{
		title: 'Электронный полис',
		type: ONLINE
	},
];
// var pseudoLinkTitles = {
// 	set1: 'Можно еще быстрее',
// 	set2: 'Вернуться ко всем шагам'
// };

class ExplanationWidget extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			currentSet: 'set3',
			switcherState: ONLINE,
			showSwitcher: false
		}
		this._update = this._update.bind(this)
		this._onCloseButtonClick = this._onCloseButtonClick.bind(this)
		this._componentWillMount()
	}
	_componentWillMount() {
		UserStore.addChangeListener(this._update);
	}
	componentWillUnmount() {
		UserStore.removeChangeListener(this._update);
	}
	componentDidMount() {
		this._update();
	}
	_update() {
		var newState = {
			visible: this._getVisibilityCondition(),
			showSwitcher: true
		};
		var newSet = null;

		if (this.state.currentSet !== 'set4' && !this._getRegionCondition() && !this._getInsuranceTypeCondition()) {
			newSet = 'set4';
		}

		if (['set3', 'set4'].indexOf(this.state.currentSet) !== -1 && this._getRegionCondition() && !this._getInsuranceTypeCondition()) {
			newSet = 'set1';
		}

		if (this.state.currentSet === 'set4' && this._getRegionCondition() && this._getInsuranceTypeCondition()) {
			newSet = 'set1';
		}

		if (newSet) {
			newState.currentSet = newSet;
		} else if (this._getInsuranceTypeCondition()) {
			newState.currentSet = 'set3';
		}

		this.setState(newState);
	}
	_getVisibilityCondition() {
		return !UserStore.checkCookiesField('explanation_visible');
	}
	_getInsuranceTypeCondition() {
		var formData = UserStore.getData();

		return !formData.type.kasko && formData.type.osago;
	}
	_getRegionCondition() {
		var formData = UserStore.getData();

		return formData.region.id === 4;
	}
	getCurrentTitle() {
		return titles[sets[this.state.currentSet].type];
	}
	_onSwitcherButtonClick(index) {
		var button = typeSwitcherButtons[index];
		var newSet = null;

		if (button.type === ONLINE) {
			newSet = 'set3';
		} else if (button.type === REGULAR) {
			if (this._getRegionCondition()) {
				newSet = 'set1';
			} else {
				newSet = 'set4';
			}
		}

		this.setState({
			currentSet: newSet
		});
	}
	// _isTogglerVisible: function() {
	// 	return Object.keys(pseudoLinkTitles).indexOf(this.state.currentSet) !== -1;
	// },
	// _onTogglerClick: function() {
	// 	var newSet = 'set2';
	//
	// 	if (this.state.currentSet === 'set2') {
	// 		newSet = 'set1';
	// 	}
	//
	// 	this.setState({
	// 		currentSet: newSet
	// 	});
	// },
	_onCloseButtonClick() {
		UserStore.setCookiesField('explanation_visible', null, 7);
		this.setState({
			visible: false
		});
	}
	render() {
		var _self = this;
		var title = <div className="font-size-x-large font-bold text-align-center padding-bottom-default">{ _self.getCurrentTitle() }</div>;
		var switcherButtons = typeSwitcherButtons.map(function(button, index) {
			var buttonClassNames = classNames('switcher__button', {
				'switcher__button--active': sets[_self.state.currentSet].type === button.type
			});

			return (
				<li
					key={ index }
					className={ buttonClassNames }
					onClick={ _self._onSwitcherButtonClick.bind(_self, index) }
				>{ button.title }</li>
			);
		});
		var switcher = _self.state.showSwitcher ? (
			<div className="text-align-center padding-bottom-default">
				<ul className="ui-button-switcher">
					{ switcherButtons }
				</ul>
			</div>
		) : null;
		var cardListItems = sets[this.state.currentSet].items.map(function(cardName, index) {
			return (
				<div key={ index } className="grid__cell grid__cell--12 grid__cell--md-3">
					<div className="grid__row">
						{ index !== 0 &&
							<div className="grid__cell grid__cell--12 grid__cell--md-min">
								<Icon name="right" size="medium" className="icon-rotate-90" />
							</div>
						}
						<div className="grid__cell grid__cell--12 grid__cell--md">
							<img
								className="display-block center-block"
								width="100"
								height="100"
								src={ cards[cardName].image }
								alt={ cards[cardName].title }
							/>
							<div className="margin-left-x-small margin-right-x-small font-size-large text-align-center margin-top-small">{ cards[cardName].title }</div>
						</div>
					</div>
				</div>
			);
		});
		var cardList = (
			<div className="padding-top-large">
				<div className="grid__row grid__row--justify-center">
					{ cardListItems }
				</div>
			</div>
		);

		// var pseudoLinkToggler = _self._isTogglerVisible() ? (
		// 	<div className="padding-top-large">
		// 		<div className="text-align-center">
		// 			<span className="pseudo-link font-size-medium" onClick={ _self._onTogglerClick }>{ pseudoLinkTitles[_self.state.currentSet] }</span>
		// 		</div>
		// 	</div>
		// ) : null;

		return _self.state.visible ? (
			<div className="explanation-widget grid-corner-pos margin-top-small">
				<Icon
					name="close"
					color="gray-gray"
					size="small"
					saturate
					clickHandler={ _self._onCloseButtonClick }
					className="grid-corner-pos__element grid-corner-pos__element--right-top icon-close"
				/>
				<div className="padding-top-small padding-right-medium padding-bottom-medium padding-left-medium">
					{ title }
					{ switcher }
					{ cardList }
				</div>
			</div>
		) : null;
	}
}

module.exports = ExplanationWidget;
