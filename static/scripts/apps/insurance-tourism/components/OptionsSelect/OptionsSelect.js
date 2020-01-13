import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	Panel,
	Tooltip,
	Icon,
	IconButton,
	Checkbox,
	Button,
} from 'react-ui-2018';
import { optionType } from '../../types';
import { emptyFunction, translitRusToEng } from '../../utils/utils';
import {
	createOptionsSelector,
	sortSelectedOptions,
	sendVisibleOptionsAction,
	sendAllOptionsAction,
} from '../../redux/modules/search';
import s from './OptionsSelect.module.styl';

import OptionsModal from '../OptionsModal/OptionsModal';

class OptionsSelect extends Component {
	static defaultProps = {
		title: '',
		titleTip: null,
		shortListCount: 3,
		options: {},
		value: [],
		showMoreControl: 'Показать все',
		onChange: emptyFunction,
		sortSelectedOptions: emptyFunction,
		optionsType: PropTypes.oneOf([
			'optionsSport',
			'optionsSubrisk',
		]),
	};

	static propTypes = {
		/** Текст заголовка */
		title: PropTypes.string,
		/** Текст подсказки заголовка */
		titleTip: PropTypes.string,
		/** Кол-во показанных фильтов в плашке */
		shortListCount: PropTypes.number,
		/** Текст контрола "все фильтры" */
		showMoreControl: PropTypes.string,
		/** Опции */
		options: PropTypes.arrayOf(optionType),
		/** Тип опций (объект в redux-сторе) */
		optionsType: PropTypes.string,
		/** Выбранные опции (массив id) */
		value: PropTypes.arrayOf(PropTypes.number),
		/** Обработчик выбора опций */
		onChange: PropTypes.func,
		/** Функция сортировки выбранных опций */
		sortSelectedOptions: PropTypes.func,
	};

	state = {
		isModalOpen: false,
	};

	closeModal = () => this.setState({ isModalOpen: false });

	openModal = () => this.setState({ isModalOpen: true });

	allOptionsClick = () => {
		sendAllOptionsAction(this.props.optionsType);
		this.openModal();
	};

	onOptionsSelect = selectedOptions => {
		this.props.onChange(selectedOptions);
	};

	onModalOptionsSelect = selectedOptions => {
		const { optionsType } = this.props;
		this.props.sortSelectedOptions(optionsType, selectedOptions);
		this.onOptionsSelect(selectedOptions);
		this.closeModal();
	};

	onClickCheckbox = optionId => {
		const value = [...this.props.value];
		const idx = value.indexOf(optionId);
		if (idx === -1) {
			value.push(optionId)
		} else {
			value.splice(idx, 1);
		}
		this.props.onChange(value);
	};

	get shortlist() {
		const { options, optionsType, shortListCount, value, } = this.props;
		return options
			.slice(0, shortListCount)
			.map(option => {
				const isSelected = value.includes(option.id);
				return (
					<div className="margin-bottom-small">
						<Checkbox
							key={ option.id }
							title={ option.displayName }
							checked={ isSelected }
							changeHandler={ () => {
								!isSelected && sendVisibleOptionsAction(optionsType, translitRusToEng(option.displayName));
								this.onClickCheckbox(option.id);
							} }
						/>
					</div>
				);
			})
	}

	get optionsModal() {
		return (
			<OptionsModal
				isOpen={ this.state.isModalOpen }
				options={ this.props.options }
				optionsType={ this.props.optionsType }
				selectedOptions={ this.props.value }
				onRequestClose={ this.closeModal }
				handleFilter={ this.onModalOptionsSelect }
			/>
		);
	}

	get info() {
		const { titleTip } = this.props;
		if (!titleTip) {
			return null;
		}
		return (
			<Tooltip content={ titleTip } position="top" trigger="mouseenter">
				<span className={ cx(s.icon, 'margin-left-x-small') }>
					<IconButton icon="info" size="medium" />
				</span>
			</Tooltip>
		);
	}

	get moreSelectedOptions() {
		const { value, options, shortListCount } = this.props;
		const selectedOptionsCount = options.reduce((acc, currentValue) => {
			if (value.includes(currentValue.id)) {
				return acc + 1;
			}
			return acc;
		}, 0);
		const diff = selectedOptionsCount - shortListCount;
		if (diff <= 0) {
			return null;
		}
		return (
			<span className="margin-left-small text-size-7 color-minor-black-lighten">
				{ `Выбрано еще ${diff}` }
			</span>
		);
	}

	render() {
		return (
			<div className="margin-top-default">
				<div className="text-size-4 text-weight-bold">
					{this.props.title}
					{this.info}
				</div>

				<Panel
					className="margin-top-small"
					sections={
						<Fragment>
							{this.shortlist}
							<div className="margin-top-medium">
								<Button
									theme="transparent-light"
									size="small"
									onClick={ this.allOptionsClick }
								>
									{this.props.showMoreControl}
								</Button>
								{this.moreSelectedOptions}
							</div>
						</Fragment>
					}
				/>

				{this.optionsModal}
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	const optionsSelector = createOptionsSelector(ownProps.optionsType);
	return {
		options: optionsSelector(state),
	};
}

export default connect(mapStateToProps, {
	sortSelectedOptions,
})(OptionsSelect);
