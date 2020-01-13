import React, { Component } from 'react';
import T from 'prop-types';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	SelectionList,
} from 'react-ui-2018';
import {
	sendChooseOptionsAction,
} from '../../redux/modules/search';
import { optionType } from '../../types';

class OptionsModal extends Component {
	static propTypes = {
		isOpen: T.bool,
		handleFilter: T.func,
		onRequestClose: T.func,
		options: T.arrayOf(optionType),
		optionsType: T.string,
		selectedOptions: T.arrayOf(T.number),
	};

	static defaultProps = {
		isOpen: false,
		handleFilter: () => {},
		optionsType: T.oneOf([
			'optionsSport',
			'optionsSubrisk',
		]),
	};

	state = {
		selectedOptions: this.props.selectedOptions,
	};

	componentWillReceiveProps({ selectedOptions }) {
		if (selectedOptions !== this.props.selectedOptions) {
			this.setState({ selectedOptions });
		}
	}

	get options() {
		const { options } = this.props;
		return (
			<SelectionList
				onChange={ this.onOptionsSelect }
				value={ this.state.selectedOptions }
			>
				{options.map(option => (
					<SelectionList.Item
						key={ option.id }
						title={ option.displayName }
						value={ option.id }
						description={ option.comment }
					/>
				))}
			</SelectionList>
		);
	}

	onOptionsSelect = selectedOptions =>
		this.setState({ selectedOptions });

	onClose = () => {
		const { onRequestClose } = this.props;
		if (onRequestClose) {
			onRequestClose();
			this.resetValues();
		}
	};

	resetValues = () => {
		const { selectedOptions } = this.props;
		this.setState({ selectedOptions });
	};

	chooseButtonClick = () => {
		const { handleFilter, optionsType } = this.props;
		sendChooseOptionsAction(optionsType);
		handleFilter(this.state.selectedOptions);
	};

	render() {
		const { isOpen } = this.props;
		return (
			<Modal
				isOpen={ isOpen }
				closeHandler={ this.onClose }
				onRequestClose={ this.onClose }
				width="740px"
				shouldCloseOnOverlayClick
				shouldCloseOnEsc
				isCloseIcon
				sticky
			>
				<ModalHeader>
					Выберите дополнительные опции
				</ModalHeader>

				<ModalBody>
					{this.options}
				</ModalBody>

				<ModalFooter>
					<Button
						onClick={ this.chooseButtonClick }
						theme="blue"
					>
						Выбрать
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

export default OptionsModal;
