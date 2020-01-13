import React, { Component, Fragment } from 'react';
import {
	Button,
	Input,
	Item,
	Flex,
	Link,
	Loader
} from 'react-ui';
import { connect } from 'react-redux';
import {
	sendSMSCodeRGS,
	setRGSCode, setRGSCodeError,
	verifySMSCodeRGS
} from '../actions';
import ContentWrapper from '../layout/ContentWrapper.jsx';
import ErrorMessage from '../elements/ErrorMessage.jsx';

class AuthSMS extends Component {
	state = {
		isCodeFilled: false
	};

	checkSmsCodeField = (code) => {
		this.props.setCode(code);
		this.props.clearRGSCodeError();
		if (code.length === 6) {
			this.setState({
				isCodeFilled: true
			});
		}
	};

	render() {
		const { isCodeFilled } = this.state;
		const { sendCode, verifyCode, rgs } = this.props;

		return (
			<Fragment>
				<ContentWrapper>
					<div className="font-size-medium">
						Перед оплатой необходимо пройти повторную смс-авторизацию от компании Росгосстрах
					</div>
					<div className="margin-top-small">
						<Flex
							alignItems="center"
							gap="default"
						>
							<Item min>
								<div className="input--medium-width">
									<Input
										name="smscode"
										mask={ '999999' }
										maskChar={ null }
										changeHandler={ this.checkSmsCodeField }
										status={ { type: rgs.code && rgs.code.error ? 'error' : '' } }
									/>
								</div>
							</Item>
							<Link
								type="pseudo"
								clickHandler={ sendCode }
							>
								Мне не пришел код
							</Link>
						</Flex>
						{ !!rgs.code && <ErrorMessage message={ rgs.code.error } /> }
					</div>
				</ContentWrapper>
				<div className="bg-gray padding-default">
					<Button
						theme="orange"
						clickHandler={ verifyCode }
						disabled={ !isCodeFilled }
					>
						Подтвердить
					</Button>
				</div>
			</Fragment>

		);
	}
}

const mapStateToProps = state => ({
	rgs: state.rgs
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	verifyCode: () => {
		dispatch(verifySMSCodeRGS());
	},
	sendCode: () => {
		dispatch(sendSMSCodeRGS());
	},
	setCode: (code) => {
		dispatch(setRGSCode(code));
	},
	clearRGSCodeError: () => {
		dispatch(setRGSCodeError(''))
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthSMS);
