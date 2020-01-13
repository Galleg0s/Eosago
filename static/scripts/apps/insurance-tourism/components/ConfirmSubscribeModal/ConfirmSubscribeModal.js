import React, { Component } from 'react';
import T from 'prop-types';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Link,
} from 'react-ui-2018';

class ConfirmSubscribeModal extends Component {
	static propTypes = {
		onHide: T.func,
	};

	render() {
		const { onHide } = this.props;
		return (
			<Modal
				closeHandler={ onHide }
				width="740px"
				shouldCloseOnOverlayClick
				shouldCloseOnEsc
				isCloseIcon
				sticky
				isOpen
			>
				<ModalHeader>
					Согласие на рассылку
				</ModalHeader>

				<ModalBody>
					<div className="text-size-5">
						<p>Настоящее согласие действует на получение рекламно-информационных материалов о страховых, банковских и иных продуктах через мобильный или стационарный телефон посредством голосовых вызовов или коротких текстовых сообщений (SMS), с использованием Интернет-мессенджеров, на электронную почту, а также через размещение информации в личном кабинете. А также в целях продвижения на рынке товаров и/ или услуг ООО «Информационное агентство «Банки.ру» и/ или третьих лиц, а также предоставления информационно-консультационных и маркетинговых услуг (включая осуществление рекламно-информационных рассылок с использованием sms-сервисов, Интернет-мессенджеров, электронную почту, а также через размещение информации в личном кабинете.
						</p>
						<p>Пользователь может отказаться от подписки на емейл-рассылку, перейдя по ссылке «Отписаться» в нижней части любой рассылки Банки.ру. Пользователь также может выразить свой отказ в получении рассылок, воспользовавшись формой обратной связи, расположенной по адресу <Link href="https://www.banki.ru/info/contacts/feedback/" target="_blank" type="pseudo">https://www.banki.ru/info/contacts/feedback/</Link>
						</p>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button
						onClick={ onHide }
						theme="blue"
						fullWidth={ banki.env.isMobileDevice }
					>
						Закрыть
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

export default ConfirmSubscribeModal;
