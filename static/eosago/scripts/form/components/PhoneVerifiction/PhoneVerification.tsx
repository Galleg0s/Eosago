import React from 'react';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {FlexboxGrid, Link, Text} from 'react-ui-2018';
import Title from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Title';
import Input, {InputType} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Input';
import CheckboxFormField
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/Checkbox';
import NavigationButtons
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/elements/NavButtons';
import AgreementModal
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/PhoneVerifiction/AgreementModal';
import {
	FORM_INITIAL_VALUES,
	OSAGO_FORM_NAME
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import {
	FormValues,
	PhoneVerificationFieldNames,
	State
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import validate
	from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/PhoneVerifiction/validate';
import {
	isAgreementModalVisibleSelector,
	isSubscribeModalVisibleSelector, toggleAgreementModal, toggleSubscribeModal
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/modals';
import {
	isCodeErrorSelector,
	isCodeFieldVisibleSelector,
	isCodeRequestingSelector,
	isCodeSendingSelector,
	isPhoneVerifiedSelector,
	phoneSendRequest,
	repeatCounterSelector
} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/phoneVerification';

interface PhoneVerificationProps {
	onPrevClick: Function,
	toggleAgreementModal: typeof toggleAgreementModal,
	toggleSubscribeModal: typeof toggleSubscribeModal,
	phoneSendRequest: typeof phoneSendRequest,
	isAgreementModalVisible: boolean,
	isSubscribeModalVisible: boolean,
	isCodeFieldVisible: boolean,
	repeatCounter: number,
	isCodeRequesting: boolean,
	isCodeSending: boolean,
	isPhoneVerified: boolean,
	isCodeError: boolean,
	isMobile: boolean,
}

export type PhoneVerificationType = PhoneVerificationProps & InjectedFormProps<FormValues, PhoneVerificationProps>;

const PhoneVerification: React.FC<PhoneVerificationType> = props => {
	const gridGap = props.isMobile ? 'small' : 'default';
	const onAgreementClick = (e: Event) => {
		e.preventDefault();
		props.toggleAgreementModal();
	};
	const onSubscribeClick = (e: Event) => {
		e.preventDefault();
		props.toggleSubscribeModal();
	};

	const getPhoneStatus = () => {
		if (props.isCodeRequesting) {
			return { message: 'Подождите...' }
		}
		if (props.isPhoneVerified) {
			return { message: 'Телефон подтвержден.', type: 'valid' }
		}
	};
	const getCodeStatus = () => {
		if (props.isCodeSending) {
			return { message: 'Подождите...' };
		}
		if (props.isCodeError) {
			return { message: 'Код неправильный', type: 'error' }
		}
	};

	return (
		<React.Fragment>
			<form>
				<FlexboxGrid gap={ gridGap } direction="vert">
					<Title>Укажите ваш телефон</Title>
					<Field
						name={ PhoneVerificationFieldNames.phone }
						component={ Input }
						type={ InputType.tel }
						mask="+7 999 999 99 99"
						parse={ (value: string) => {
							return value.replace('+7', '').replace(/ /g, '');
						} }
						status={ getPhoneStatus() }
						disabled={ props.isCodeRequesting || props.isPhoneVerified }
						autoFocus={ true }
					/>
					{ props.isCodeFieldVisible &&
					<React.Fragment>
						<Field
							name={ PhoneVerificationFieldNames.code }
							component={ Input }
							mask="9999"
							label="СМС-код"
							status={ getCodeStatus() }
							disabled={ props.isCodeSending }
							autoFocus={ true }
							type={ InputType.tel }
						/>
							<Text
								color="minor-black-lighten"
							>
								<Link
									size="xsmall"
									disabled={ props.repeatCounter > 0 }
									onClick={ props.phoneSendRequest }
								>
									Получить SMS-код повторно{ props.repeatCounter > 0 ? `, ${ props.repeatCounter } сек.` : '.' }
								</Link>
							</Text>
					</React.Fragment>
					}
					<Field
						name={ PhoneVerificationFieldNames.isSubscribe }
						component={ CheckboxFormField }
						title={ (
							<Text
								color="minor-black-lighten"
							>
								Я соглашаюсь с <Link type="pseudo" theme="alt" onClick={ onAgreementClick }>Условиями передачи данных</Link> и подтверждаю свое согласие на получение рекламных и информационных рассылок от Банки.ру на указанные мной e-mail и номер телефона
							</Text>
						) }
					/>
					{/*<Field*/}
					{/*	name={ PhoneVerificationFieldNames.isSubscribe }*/}
					{/*	component={ CheckboxFormField }*/}
					{/*	title={ (*/}
					{/*		<Text*/}
					{/*			color="minor-black-lighten"*/}
					{/*		>*/}
					{/*			Подтверждаю свое согласие на получение информационных писем и СМС от Банки.ру на указанный e-mail и телефон*/}
					{/*		</Text>*/}
					{/*	) }*/}
					{/*/>*/}
					<NavigationButtons
						isMobile={ props.isMobile }
						handleSubmit={ props.handleSubmit }
						onPrevClick={ props.onPrevClick }
						isNextDisabled={ props.invalid || !props.isPhoneVerified }
					/>
				</FlexboxGrid>
			</form>
			<AgreementModal isOpen={ props.isAgreementModalVisible } closeModal={ props.toggleAgreementModal } />
		</React.Fragment>
	)
};

const PhoneVerificationForm = reduxForm<FormValues, PhoneVerificationProps>({
	form: OSAGO_FORM_NAME,
	initialValues: FORM_INITIAL_VALUES,
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate,
})(PhoneVerification);

export default connect(
	(state: State) => ({
		isAgreementModalVisible: isAgreementModalVisibleSelector(state),
		isSubscribeModalVisible: isSubscribeModalVisibleSelector(state),
		isCodeFieldVisible: isCodeFieldVisibleSelector(state),
		repeatCounter: repeatCounterSelector(state),
		isCodeRequesting: isCodeRequestingSelector(state),
		isCodeSending: isCodeSendingSelector(state),
		isPhoneVerified: isPhoneVerifiedSelector(state),
		isCodeError: isCodeErrorSelector(state),
	}),
	{ toggleAgreementModal, toggleSubscribeModal, phoneSendRequest }
)(PhoneVerificationForm);
