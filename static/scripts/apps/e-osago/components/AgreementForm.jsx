import React from 'react';
import classNames from 'classnames';
import { Popup } from 'react-ui';
import AgreementPopup from './AgreementPopup.jsx';

class AgreementForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			agreementPopupVisible: false
		};

		this.changeEventHandler = this.changeEventHandler.bind(this);
		this._agreementPopupHandler = this._agreementPopupHandler.bind(this);
	}

	changeEventHandler(event) {
		const { changeHandler } = this.props;

		let target = event.target;
		let type = target ? target.type : event.type;
		let name = target ? target.name || 'unnamed' : event.name || 'unnamed';
		let valueProp = type === 'checkbox' ? 'checked' : 'value';
		let value = target ? target[valueProp] : event[valueProp];

		changeHandler(name, value);
	}

	_agreementPopupHandler(isOpen) {
		return (event) => {
			event && event.preventDefault();
			this.setState({
				agreementPopupVisible: isOpen
			});
		}
	}

	render() {
		const { data, isMobile } = this.props;

		const wrapperCls = classNames('grid-vert-list-default bg-gray border-bottom-solid', {
			'padding-top-default padding-right-medium padding-bottom-default padding-left-medium': !isMobile,
			'padding-top-default padding-right-small padding-bottom-default padding-left-small': isMobile
		});

		return (
			<div className={ wrapperCls }>
				<div>
					<label>
						<input
							type="checkbox"
							className="modern-checkbox"
							checked={ data.subscribe }
							name="subscribe"
							onChange={ this.changeEventHandler }
						/>
						<span className="checkbox-label font-size-medium">
								Я соглашаюсь с &nbsp;
							<span
								className="pseudo-link"
								onClick={ this._agreementPopupHandler(true) }
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
				{/*			checked={ data.subscribe }*/}
				{/*			name="subscribe"*/}
				{/*			onChange={ this.changeEventHandler }*/}
				{/*		/>*/}
				{/*		<span className="checkbox-label font-size-medium">*/}
				{/*			Подтверждаю свое согласие на получение информационных писем и СМС от Банки.ру на указанный e-mail и телефон*/}
				{/*		</span>*/}
				{/*	</label>*/}
				{/*</div>*/}
				<Popup
					size="large"
					isOpen={ this.state.agreementPopupVisible }
					needOverlay={ true }
					centered={ false }
					closeHandler={ this._agreementPopupHandler(false) }
				>
					<AgreementPopup />
				</Popup>
			</div>
		);
	}
}

export default AgreementForm;
