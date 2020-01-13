import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import {
	MODAL_TYPE_GUARANTEED_OPTIONS,
	MODAL_TYPE_CONFIRM_SUBSCRIBE,
	MODAL_TYPE_CONFIRM_TERMS,
	popModal,
} from '../../redux/modules/modals';
import GuaranteedOptionsModal from '../../components/GuaranteedOptionsPopup/GuaranteedOptionsModal';
import ConfirmSubscribeModal from '../../components/ConfirmSubscribeModal/ConfirmSubscribeModal';
import ConfirmTermsModal from '../../components/ConfirmTermsModal/ConfirmTermsModal';

const ModalComponents = {
	[MODAL_TYPE_GUARANTEED_OPTIONS]: GuaranteedOptionsModal,
	[MODAL_TYPE_CONFIRM_SUBSCRIBE]: ConfirmSubscribeModal,
	[MODAL_TYPE_CONFIRM_TERMS]: ConfirmTermsModal,
};

class ModalRoot extends Component {
	static propTypes = {
		modals: T.arrayOf(
			T.shape({
				type: T.string.isRequired,
				props: T.shape(),
			}),
		),
		onHide: T.func,
	};

	static defaultProps = {
		modals: [],
		onHide: () => {},
	};

	render() {
		const { modals } = this.props;
		return modals.map(modal => {
			const SpecificModal = ModalComponents[modal.type];
			return (
				<SpecificModal
					key={ modal.type }
					{ ...modal.props }
					onHide={ () => this.props.popModal(modal) }
				/>
			);
		});
	}
}

function mapStateToProps({ modals }) {
	return {
		modals,
	};
}

export default connect(mapStateToProps, {
	popModal,
})(ModalRoot);
