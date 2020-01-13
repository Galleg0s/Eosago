var React = require('react');
var UserStore = require('../stores/user-store.js');
var PopupStore = require('../stores/popup-store.js');
var ResultStore = require('../stores/result-store.js');
import { Icon } from 'react-ui';

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			popup: PopupStore.getPopup('leadPopup'),
			url: null,
			popupHeight: null
		}
		this._update = this._update.bind(this)
		this._closePopup = this._closePopup.bind(this)
		this._componentWillMount()
	}
	_componentWillMount() {
		ResultStore.addLeadClickListener(this._update);
	}
	componentWillUnmount() {
		ResultStore.removeLeadClickListener(this._update);
	}
	_update(lead) {
		this.setState({
			url: lead.info,
			popupHeight: lead.popupHeight
		});

		this._showPopup();
	}
	_showPopup() {
		this.state.popup.showPopup.apply(this.state.popup);
	}
	_closePopup() {
		this.state.popup.hidePopup.apply(this.state.popup);
	}
	render() {
		return (
			<div>
				<Icon name="close" size="small" clickHandler={ this._closePopup } className="ui-popup__close-icon icon-hover" />
				<iframe
					src={ this.state.url }
					width="100%"
					height={ this.state.popupHeight }
					frameBorder="0"
					style={ {display: 'block'} }
				></iframe>
			</div>
		);
	}
};
