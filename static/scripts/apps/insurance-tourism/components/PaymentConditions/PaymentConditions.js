import React, { Component } from 'react';
import cx from 'classnames';
import {
	Button,
	Link,
	Modal,
	ModalHeader,
	ModalFooter,
	ModalBody,
	TextList
} from 'react-ui-2018';
import alfaLogo from './alfabank-logo-128.png';
import mirLogo from './mir-logo-128.png';
import mcLogo from './mc-logo-128.png';
import visaLogo from './visa-logo-128.png';
import s from './PaymentConditions.module.styl';

class PaymentConditions extends Component {
	state = {
		isModalOpen: false,
	};

	openModal = () => this.setState({ isModalOpen: true });

	closeModal = () => this.setState({ isModalOpen: false });

	get modal() {
		const { isModalOpen } = this.state;
		return (
			<Modal
				isOpen={ isModalOpen }
				closeHandler={ this.closeModal }
				onRequestClose={ this.closeModal }
				width="740px"
				shouldCloseOnOverlayClick
				shouldCloseOnEsc
				isCloseIcon
				sticky
			>
				<ModalHeader>
					Правила оплаты, безопасность платежей и условия возврата
				</ModalHeader>
				<ModalBody>
					<h4 className="text-size-4 text-weight-bold margin-bottom-default">
						Правила оплаты и безопасность платежей, конфиденциальность информации
					</h4>
					<div className="text-size-5">
						<p className="margin-bottom-medium">
							Оплата банковскими картами осуществляется через АО «Альфа-Банк». К оплате принимаются карты VISA, MasterCard, Платежной системы «Мир». Услуга оплаты через интернет осуществляется в соответствии с Правилами международных платежных систем Visa, MasterCard и Платежной системы «Мир» на принципах соблюдения конфиденциальности и безопасности совершения платежа, для чего используются самые современные методы проверки, шифрования и передачи данных по закрытым каналам связи.
						</p>
						<p className="margin-top-medium margin-bottom-medium">
							Ввод данных банковской карты осуществляется на защищенной платежной странице АО «Альфа-Банк». На странице для ввода данных банковской карты потребуется ввести номер карты, имя владельца карты, срок действия карты, трехзначный код безопасности (CVV2 для VISA или CVC2 для MasterCard). Все необходимые данные пропечатаны на банковской карте. Трехзначный код безопасности — это три цифры, находящиеся на обратной стороне карты. После ввода реквизитов карты вы будете перенаправлены на страницу вашего банка для ввода 3DSecure кода, который придет вам в СМС. Если 3DSecure код не пришел, обратитесь в банк, выдавший карту.
						</p>
						<p className="margin-top-medium margin-bottom-small">
							Причины отказа в совершении платежа:
						</p>
						<TextList
							data={ {
								list: [
									{
										text: 'Банковская карта не предназначена для совершения платежей через Интернет. За подробностями необходимо обращаться в банк, выпустивший карту.',
									},
									{
										text: 'На банковской карте недостаточно средств для оплаты. Подробнее о наличии средств на банковской карте можно узнать, обратившись в банк, выпустивший карту.',
									},
									{
										text: 'Данные банковской карты введены неверно.',
									},
									{
										text: 'Истек срок действия банковской карты. Срок действия карты (месяц и год), как правило, указан на лицевой стороне карты. Подробнее о сроке действия карты можно узнать, обратившись в банк, выпустивший карту.'
									},
								]
							} }
							bulletsType="circle-fill"
						/>
						<p className="margin-top-medium margin-bottom-medium">
							По вопросам оплаты с помощью банковской карты и иным вопросам, связанным с работой сайта, обращайтесь по телефону: <Link href="tel:84956655255" type="pseudo">8 (495) 665-52-55</Link>
						</p>
						<p className="margin-top-medium margin-bottom-medium">
							Предоставляемая вами персональная информация (имя, адрес, телефон, e-mail, номер банковской карты) конфиденциальна и не подлежит разглашению. Данные вашей банковской карты передаются исключительно в зашифрованном виде и не сохраняются на нашем Web-сервере.
						</p>
					</div>
					<h4 className="text-size-4 text-weight-bold margin-bottom-default">
						Правила расторжения договора и возврата денежных средств
					</h4>
					<div className="text-size-5">
						<p className="margin-bottom-medium">
							Условия расторжения договора и возврата денежных средств регулируются правилами страховой компании, с которой заключен договор, и правилами платежных систем. Возврат наличными денежными средствами не допускается.
						</p>
						<p className="margin-top-medium margin-bottom-medium">
							Для расторжения договора и возврата денежных средств на банковскую карту до наступления даты начала страхования, необходимо написать сообщение на  электронный адрес insurance@banki.ru с указанием наименования страховой компании, номера полиса и ФИО страхователя, приложив к письму копию паспорта страхователя.
						</p>
						<p className="margin-top-medium">
							Для расторжения договора и возврата денежных средств на банковскую карту после наступления даты начала страхования, необходимо обратиться в страховую компанию, с которой заключен договор.
						</p>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						onClick={ this.closeModal }
						theme="blue"
						fullWidth={ banki.env.isMobileDevice }
					>
						Закрыть
					</Button>
				</ModalFooter>
			</Modal>
		);
	}

	render() {
		return (
			<div>
				<div className={ s.container }>
					<div className="padding-x-small-fixed">
						<img src={ alfaLogo } alt="Альфа Банк" />
					</div>
					<div className="padding-x-small-fixed">
						<img src={ mirLogo } alt="МИР" />
					</div>
					<div className="padding-x-small-fixed">
						<img src={ mcLogo } alt="Master Card" />
					</div>
					<div className="padding-x-small-fixed">
						<img src={ visaLogo } alt="VISA" />
					</div>
				</div>
				<div className="text-align-center margin-top-small">
					<Link onClick={ this.openModal } size="small">
						Правила оплаты и безопасность платежей
					</Link>
				</div>
				{this.modal}
			</div>
		);
	}
}

export default PaymentConditions;
