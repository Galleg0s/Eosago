import React, { Component } from 'react';
import T from 'prop-types';
import { Field } from 'redux-form';
import {
	FormField,
	Button,
	Dropdown,
	DropdownButton,
	Panel,
	Icon,
} from 'react-ui-2018';
import { getPluralForm } from 'helpers';
import AddTouristButton from '../AddTouristButton/AddTouristButton';
import CheckboxField from '../CheckboxField/CheckboxField';
import TouristField from '../TouristField/TouristField';
import s from './ToristsArrayField.module.styl';

const MAX_TOURISTS = 5;

class TouristsArrayField extends Component {
	static propTypes = {
		fields: T.shape().isRequired,
	};

	static defaultProps = {};

	state = {
		isOpened: false,
	};

	get tourists() {
		const { fields } = this.props;
		return (
			<div>
				<ul>
					{fields.map((tourist, index) => {
						// Автофокус на последнем инпуте
						const shouldFocusOnMount = index + 1 === fields.length;
						return (
							<li key={ index } className={ s.touristItem }>
								<Field
									id={ `${tourist}.age` }
									name={ `${tourist}.age` }
									component={ TouristField }
									onRemove={ () => this.removeTourist(index) }
									canRemove={ fields.length > 1 }
									shouldFocusOnMount={ shouldFocusOnMount }
								/>
							</li>
						);
					})}
				</ul>
				{this.addBtn}
			</div>
		);
	}

	get addBtn() {
		const { fields } = this.props;
		if (fields.length >= MAX_TOURISTS) {
			return null;
		}
		return (
			<div className="padding-small-fixed text-nowrap">
				<AddTouristButton onClick={ this.addTourist } />
			</div>
		);
	}

	get menuFooter() {
		return (
			<div className="padding-top-small-fixed">
				<Field
					name="foreigners"
					title="Есть иностранные граждане"
					component={ CheckboxField }
				/>
			</div>
		);
	}

	get menu() {
		return (
			<Panel
				sections={ [
					this.tourists,
					// this.menuFooter,
				] }
				shadowLevel={ 3 }
				noPaddingContent
			/>
		);
	}

	get btnTitle() {
		const { fields, meta } = this.props;
		const count = fields.length;
		if (meta.error) {
			return null;
		}
		return getPluralForm(count, ['человек', 'человека', 'человек']);
	}

	get placeholder() {
		const { meta } = this.props;
		if (meta.error) {
			return meta.error;
		}
		return 'Возраст';
	}

	toggleDropDown = () => {
		this.setState(prevState => ({ isOpened: !prevState.isOpened }));
	};

	closeDropDown = () => {
		this.setState({ isOpened: false });
	};

	addTourist = () => {
		const { fields } = this.props;
		if (fields.length < MAX_TOURISTS) {
			fields.push({});
		}
	};

	removeTourist = index => {
		const { fields } = this.props;
		if (fields.length === 1) {
			return;
		}
		fields.remove(index);
	};

	renderDropdownTarget = ({ ref }) => {
		const { size, status } = this.props;
		const { isOpened } = this.state;
		return (
			<DropdownButton
				size={ size }
				status={ status }
				onClick={ this.toggleDropDown }
				isOpened={ isOpened }
				content={ this.btnTitle }
				placeholder={ this.placeholder }
				onRef={ ref }
				fullWidth
			/>
		);
	};

	render() {
		const { status } = this.props;
		return (
			<div className={ `${s.root} ${s[status]}` }>
				<Dropdown
					target={ this.renderDropdownTarget }
					menuClassName={ s.menu }
					isOpened={ this.state.isOpened }
					handleClose={ this.closeDropDown }
					dropdownClass={ s.dropdown }
				>
					{this.menu}
				</Dropdown>
			</div>
		);
	}
}

// eslint-disable-next-line
export default function renderTouristsArrayField({ label, hasForeigners, ...props }) {
	const { submitFailed, error } = props.meta;
	const getFieldStatus = () => {
		if (submitFailed && error) {
			return {
				type: 'error',
			};
		}
		return {
			type: 'default',
			message: hasForeigners ? 'Есть иностранные граждане' : '',
		};
	};

	return (
		<FormField
			label={ label }
			component={ TouristsArrayField }
			status={ getFieldStatus() }
			{ ...props }
		/>
	);
}
