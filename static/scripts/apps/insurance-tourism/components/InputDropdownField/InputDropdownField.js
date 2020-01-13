import React, { Component } from 'react';
import { Dropdown, DropdownButton, FormField, Input, MenuList, Panel } from 'react-ui-2018';
import styles from './InputDropdownField.module.styl';

class InputDropdownField extends Component {

	static defaultProps = {};

	state = {
		isOpened: false,
	};

	toggleDropDown = () => {
		this.setState(prevState => ({ isOpened: !prevState.isOpened }));
	};

	closeDropDown = () => {
		this.setState({ isOpened: false });
	};

	handleChange = value => {
		this.props.onChange(value.content);
		this.closeDropDown();
	};

	renderDropdownTarget = ({ ref }) => {
		const { size, status } = this.props;
		const { isOpened } = this.state.isOpened;
		return (
			<DropdownButton
				size={ size }
				status={ status }
				onClick={ this.toggleDropDown }
				isOpened={ isOpened }
				content={ this.btnTitle }
				onRef={ ref }
				fullWidth
			/>
		);
	};

	get btnTitle() {
		const { value } = this.props;
		if (!value) {
			// TODO - Пофиксить прыгающую высоту кнопки при отсутствующем значении
			return (
				<span className="color-white">0</span>
			);
		}
		return `${value} дн.`;
	}

	render() {
		const { items, size, status } = this.props;
		const { isOpened } = this.state;
		return (
			<div>
				<Dropdown
					target={ this.renderDropdownTarget }
					isOpened={ isOpened }
					handleClose={ this.closeDropDown }
					dropdownClass={ styles.dropdown }
				>
					<Panel
						sections={ <MenuList items={ items } onClickItem={ this.handleChange } /> }
						shadowLevel={ 3 }
						noPaddingContent
					/>
				</Dropdown>
			</div>
		);
	}
}

// eslint-disable-next-line
export default function renderInputDropdownField({ label, input, hasForeigners, size, ...props }) {
	const { submitFailed, error } = props.meta;
	const getFieldStatus = () => {
		if (submitFailed && error) {
			return {
				type: 'error',
			};
		}
		return {
			type: 'default',
		};
	};

	return (
		<FormField
			label={ label }
			component={ InputDropdownField }
			status={ getFieldStatus() }
			size={ size }
			value={ input.value }
			onChange={ input.onChange }
			{ ...props }
		/>
	);
}
