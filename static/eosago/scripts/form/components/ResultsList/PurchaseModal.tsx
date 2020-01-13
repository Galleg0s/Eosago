import React from 'react';
import { Modal, ProgressBar, Text } from 'react-ui-2018';
import WheelIcon from '../../../../images/results/wheel.svg';
import Logo from './Logo';
import NotFoundImg from '../../../../images/results/not-found.png';
import classNames from 'classnames';
import styles from './styles.ts.module.styl';
import { REQUEST_STATUS } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import { LOADER_CONFIG } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';

class PurchaseModal extends React.Component {
	state = {
		progressPercent: LOADER_CONFIG.LOADER_START_PERCENT,
	};

	startLoader = () => {
		this.loader = setInterval(this.increasePercent, LOADER_CONFIG.LOADER_FREQ);
	};

	resetLoader = () => {
		clearInterval(this.loader);
		this.setState({
			progressPercent: LOADER_CONFIG.LOADER_START_PERCENT,
		});
	};

	increasePercent = () => {
		this.setState(prevState => ({
			progressPercent: prevState.progressPercent + LOADER_CONFIG.LOADER_STEP,
		}));
	};

	closeHandler = () => {
		this.props.setRequestStatus(REQUEST_STATUS.IDLE);
		this.props.toggleModal();
	};

	render() {
		const rootCls = classNames(
			{ [styles.modalCenteredContent]: this.props.isMobile },
			'padding-vert-default padding-hor-3xl text-align-center',
		);

		return (
			<Modal
				isOpen={ this.props.isOpen }
				onAfterOpen={ this.startLoader }
				onAfterClose={ this.resetLoader }
				closeHandler={ this.closeHandler }
				isCloseIcon={ true }
				isFullHeight={ true }
				width="504px"
				contentPadding={ false }
			>
				<Modal.Body>
					<div className={ rootCls }>
						{ this.props.requestStatus === REQUEST_STATUS.REJECTED ? (
							<div className="text-align-center">
								<div className="margin-bottom-small">
									<img src={ NotFoundImg } alt="Извините, что-то пошло не так. Попробуйте выбрать другое предложение. " />
								</div>
								<div className="margin-bottom-x-small">
									<Text tagName="p" size="5" weight="bold">Извините, что-то пошло не так.</Text>
								</div>
								<Text tagName="p" size="5">Попробуйте выбрать другое предложение.</Text>
							</div>
						) : (
							<>
								<img
									className="margin-bottom-medium"
									src={ WheelIcon }
									width="65"
									height="65"
									alt="Загружаем платёжную ссылку"
								/>

								<div className="margin-bottom-medium">
									<Text tagName="p" size="5">
										Уточняем цену у страховой компании
									</Text>
								</div>

								<div className="margin-bottom-medium">
									<Logo policy={ this.props.policy } />
								</div>

								<ProgressBar
									now={ this.state.progressPercent }
									showPercentage={ false }
								/>
							</>
						)}
					</div>
				</Modal.Body>
			</Modal>
		)
	}
}

export default PurchaseModal;
