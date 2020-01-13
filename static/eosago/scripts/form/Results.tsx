import React from 'react';
import router from 'router';
import classNames from 'classnames';
import Media from 'react-media';

import {
	Button,
	FlexboxGrid,
	FlexboxGridItem,
	Text,
} from 'react-ui-2018';

import {mediaQuery} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';
import Modal from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/Modal';
import ResultsList from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/components/ResultsList';

const homeUrl = router.generate('bankiru_insurance_eosago_redesign');

const Header = ({ isMobile }: any) => {
	const headerCls = classNames(
		isMobile ? 'padding-hor-default' : '',
	);

	return (
		<div className="padding-bottom-default">
			<FlexboxGrid justifyContent="space-between" alignItems="center">
				<FlexboxGridItem>
					<div className={ headerCls }>
						<Text tagName="h1" size="1" weight="bolder">Результаты расчёта</Text>
					</div>
				</FlexboxGridItem>
				{ !isMobile && (
					<FlexboxGridItem min>
						<Button
							theme="transparent-light"
							href={ homeUrl }
						>
							Новый расчёт
						</Button>
					</FlexboxGridItem>
				)}
			</FlexboxGrid>
		</div>
	)
};

class Results extends React.Component<any, any> {
	state = {
		isModalOpen: false
	};

	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	render() {
		return (
			<div className="bg-minor-black-lighten2 padding-top-default">
				<Media queries={ { isMobile: mediaQuery.xs } }>
					{ ({ isMobile }: any) => {
						return (
							<div className={ !isMobile ? 'layout-wrapper' : '' }>
								<Header isMobile={ isMobile } />

								{/* @todo добавить параметры на 2 этапе
									<Parameters openModal={ this.toggleModal } isMobile={ isMobile } />
								*/}

								<ResultsList isMobile={ isMobile } />

								<Modal
									isModalOpen={ this.state.isModalOpen }
									closeModal={ this.toggleModal }
									isMobile={ isMobile }
								/>
							</div>
						)
					}}
				</Media>
			</div>
		)
	}
}

export default Results;
