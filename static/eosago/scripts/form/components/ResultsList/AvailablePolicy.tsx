import React from 'react';
import { FlexboxGrid, FlexboxGridItem, Text } from 'react-ui-2018';
import Logo from './Logo';
import PurchaseButton from './PurchaseButton';
import PurchaseModal from './PurchaseModal';
import { moneyFormat } from 'helpers';
import { Policy, RequestStatus } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/types';
import { POLICY_STATUSES, REQUEST_STATUS } from '../../redux/modules/results/constants';

interface Props {
	isMobile: boolean,
	purchaseStart: (result: any, check_result_id: number) => void;
	policy: Policy;
	resultInfoRequestStatus: RequestStatus;
	requestStatus: RequestStatus;
	setRequestStatus: () => void;
}

interface State {
	isModalOpen: boolean
}

class AvailablePolicy extends React.Component<Props, State> {
	state = {
		isModalOpen: false,
	};

	toggleModal = () => {
		this.setState((prevState) => ({
			isModalOpen: !prevState.isModalOpen,
		}));
	};

	closeModal = () => {
		this.setState((prevState) => ({
			isModalOpen: !prevState.isModalOpen,
		}));
	};

	btnClickHandler = () => {
		this.props.purchaseStart(this.props.policy.company.id, this.props.policy.check_result_id);
		this.toggleModal();
	};

	render() {
		const { policy, isMobile, resultInfoRequestStatus } = this.props;
		const isPending = resultInfoRequestStatus === REQUEST_STATUS.PENDING;

		return (
			<>
				{
					this.props.isMobile ? (
						<FlexboxGrid direction="vert" gap="small">
							<div className="padding-bottom-default border-bottom">
								<FlexboxGrid alignItems="center">
									<FlexboxGridItem><Logo policy={ policy } /></FlexboxGridItem>
									<FlexboxGridItem min>
										{ isPending && (policy.status !== POLICY_STATUSES.accept) ? null : (
											<>
												<div className="padding-bottom-small color-minor-black-lighten">
													<Text tagName="p" size="6">Стоимость</Text>
												</div>
												<span className="text-size-3 text-weight-bolder text-nowrap">{ moneyFormat(policy.premium_sum) } ₽</span>
											</>
										) }
									</FlexboxGridItem>
								</FlexboxGrid>
							</div>

							<PurchaseButton
								isMobile={ isMobile }
								btnClickHandler={ this.btnClickHandler }
								isLoading={ policy.status === POLICY_STATUSES.pending }
							/>
						</FlexboxGrid>
					) : (
						<FlexboxGrid alignItems="center">
							<FlexboxGridItem><Logo policy={ policy } /></FlexboxGridItem>
							<FlexboxGridItem>
								<FlexboxGrid alignItems="center">
									<FlexboxGridItem>
										{ isPending && (policy.status !== POLICY_STATUSES.accept) ? null : (
												<Text tagName="span" size="3" weight="bolder">{ moneyFormat(policy.premium_sum) } ₽</Text>
										) }
									</FlexboxGridItem>
									<PurchaseButton
										isMobile={ isMobile }
										btnClickHandler={ this.btnClickHandler }
										isLoading={ policy.status === POLICY_STATUSES.pending }
									/>
								</FlexboxGrid>
							</FlexboxGridItem>
						</FlexboxGrid>
					)
				}

				<PurchaseModal
					isMobile={ isMobile }
					isOpen={ this.state.isModalOpen }
					policy={ policy }
					toggleModal={ this.toggleModal }
					requestStatus={ this.props.requestStatus }
					setRequestStatus={ this.props.setRequestStatus }
				/>
			</>
		)
	}
}

export default AvailablePolicy;
