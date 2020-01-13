import React from 'react';
import classNames from 'classnames';
import UnavailablePolicy from './UnavailablePolicy';
import Header from './Header';
import AvailablePolicy from './AvailablePolicy';
import { POLICY_STATUSES, REQUEST_STATUS } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/constants';
import { Policy } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux/modules/results/types';

const Policies = ({ policies, isMobile, purchaseStart, resultInfoRequestStatus, requestStatus, setRequestStatus }: any) => {
	const rootDesktopCls = classNames(
		'shadow-level-1 margin-bottom-2xl border-radius-default'
	);

	const rootCls = classNames(
		isMobile ? 'margin-bottom-2xl' : rootDesktopCls,
	);

	return (
		<div className={ rootCls }>
			{ !isMobile && <Header policies={ policies } /> }
			{ policies
				.map((policy: Policy, index: number) => {
					const isLast = index === policies.length - 1;

					const policyCls = classNames(
						'bg-white padding-default',
						isMobile ? 'margin-bottom-medium shadow-level-1' : 'border-top-colorMinorGrayLighten',
						!isMobile && isLast ? 'border-radius-bottom-default' : ''
					);

					const isPending = resultInfoRequestStatus === REQUEST_STATUS.PENDING;
					const isNotDecline = policy.status !== POLICY_STATUSES.decline;
					const isAccept = policy.status === POLICY_STATUSES.accept;
					const showAccepted = isPending ? isNotDecline : isAccept;

					return (
						<div className={ policyCls } key={ policy.check_result_id }>
							{ showAccepted ? (
								<AvailablePolicy
									policy={ policy }
									isMobile={ isMobile }
									purchaseStart={ purchaseStart }
									resultInfoRequestStatus={ resultInfoRequestStatus }
									requestStatus={ requestStatus }
									setRequestStatus={ setRequestStatus }
								/>
							) : (
								<UnavailablePolicy
									policy={ policy }
									isMobile={ isMobile }
								/>
							) }
						</div>
					)
				})}
		</div>
	)
};

export default Policies;
