import React from 'react';
import { Modal } from 'react-ui-2018';
import { MarkdownInside } from '@MAIN-REACT-COMPONENTS/index.js';
import agreement from '@BUNDLES/InsuranceBundle/Resources/static/scripts/_common/data/agreement.html';

export interface AgreementModalProps {
	isOpen: boolean,
	closeModal: Function,
}

export default function AgreementModal(props: AgreementModalProps) {
	return (
		<Modal
			isOpen={ props.isOpen }
			closeHandler={ props.closeModal }
			sticky
		>
			<Modal.Header>
				<div className="header-h2">Условия передачи данных</div>
			</Modal.Header>
			<Modal.Body>
				<MarkdownInside html={ agreement } theme="light" listType="circle-fill" indent="small" />
			</Modal.Body>
		</Modal>
	)
}
