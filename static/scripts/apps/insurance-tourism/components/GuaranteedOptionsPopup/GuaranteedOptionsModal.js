import React, { Component } from 'react';
import T from 'prop-types';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	GridWrapper,
	GridRow,
	GridCol,
} from 'react-ui-2018';

class GuaranteedOptionsModal extends Component {
	static propTypes = {
		onRequestClose: T.func,
		onHide: T.func,
	};

	static defaultProps = {
		onHide: () => {},
	};

	onClose = () => {
		const { onRequestClose } = this.props;
		if (onRequestClose) {
			onRequestClose();
		}
	};

	render() {
		const { onHide } = this.props;
		return (
			<Modal
				isOpen
				closeHandler={ onHide }
				onRequestClose={ onHide }
				width="790px"
				shouldCloseOnOverlayClick
				shouldCloseOnEsc
				isCloseIcon
			>
				<ModalHeader>
					<span>Гарантированные риски</span>
				</ModalHeader>
				<ModalBody>
					<p className="text-size-5">В соответствии с законодательством каждый полис включает возмещение следующих расходов:</p>
					<div className="margin-top-small text-size-5">
						<GridWrapper>
							<GridRow>
								<GridCol md={ 6 }>
									<p className="margin-top-small">1. Прием врача по медицинским показаниям</p>
									<p className="margin-top-small">2. Амбулаторное лечение </p>
									<p className="margin-top-small">3. Госпитализация</p>
								</GridCol>
								<GridCol md={ 6 }>
									<p className="margin-top-small">4. Медицинская транспортировка</p>
									<p className="margin-top-small">5. Экстренная стоматология</p>
									<p className="margin-top-small">6. Посмертная репатриация</p>
								</GridCol>
							</GridRow>
						</GridWrapper>
					</div>
					<h4 className="text-size-4 text-weight-bold margin-top-medium">Дополнительные риски</h4>
					<p className="text-size-5 margin-top-small">Полис может включать защиту и от других рисков. Например, помощь при обострении аллергических реакций или при солнечных ожогах. Выбрать такие предложения можно с помощью специального фильтра.</p>
					<h4 className="text-size-4 text-weight-bold margin-top-medium">Расширенное покрытие</h4>
					<p className="text-size-5 margin-top-small">Обеспечьте максимальную защиту на период путешествия – включите в покрытие дополнительные параметры защиты, такие как страхование от утраты багажа или страхование при занятии активными видами спорта.</p>
				</ModalBody>
				<ModalFooter>
					<Button
						theme="blue"
						onClick={ onHide }
						fullWidth={ banki.env.isMobileDevice }
					>
						Понятно
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

export default GuaranteedOptionsModal;
