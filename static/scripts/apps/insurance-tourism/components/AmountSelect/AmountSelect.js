import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Panel, Icon } from 'react-ui-2018';
import s from './AmountSelect.module.styl';
import { formatSum } from '../../helpers';

class AmountSelect extends Component {
	static propTypes = {
		/** Данные для dropDown-а */
		options: PropTypes.arrayOf(PropTypes.number).isRequired,
		/** Выбранное значение */
		value: PropTypes.number,
		/** нужно ли закрытие DropDown-а при клике за его пределами */
		outerClosing: PropTypes.bool,
		/** нужно ли закрытие DropDown-а при клике за его пределами */
		currency: PropTypes.string,
		/** small - для мобильной версии */
		size: PropTypes.oneOf('small', 'default')
	};

	static defaultProps = {
		outerClosing: true,
		size: 'default'
	};

	state = {
		isOpened: false,
	};

	componentWillReceiveProps(nextProps) {

		// события на изменение суммы
		if (nextProps.value > this.props.value) {
			pushGtmEvent('VZR_SERVIS', 'click_summa_plyus', undefined, undefined);
		} else if (nextProps.value < this.props.value) {
			pushGtmEvent('VZR_SERVIS', 'click_summa_minus', undefined, undefined);
		}
	}

	openMenu = () => this.setState({ isOpened: true });

	closeMenu = () => this.setState({ isOpened: false });

	clickPlusHandler = () => {
		const { options, value, currency } = this.props;
		const currentIdx = options.indexOf(value);
		const nextValue = options[currentIdx + 1];
		if (nextValue) {
			this.onChange(nextValue, currency);
		}
	};

	clickMinusHandler = () => {
		const { options, value, currency } = this.props;
		const currentIdx = options.indexOf(value);
		const nextValue = options[currentIdx - 1];
		if (nextValue) {
			this.onChange(nextValue, currency)
		}
	};

	onChange = value => {
		const { onChange, currency } = this.props;
		this.closeMenu();
		if (onChange) {
			onChange(value, currency);
		}
	};

	renderDropdownTarget = ({ ref }) => {
		const { value, currency, size } = this.props;

		const wrapperCls = classNames(
			'flexbox',
			'flexbox--row',
			'flexbox--justify-content_space-between',
			'flexbox--gap_small',
			'clickable',
			'text-size-2',
			{
				'text-weight-bold': size === 'default',
				'text-weight-medium': size === 'small'
			}
		);

		const contentCls = classNames(
			'flexbox__item',
			'text-align-center',
			'clickable',
			s.clickable,
		);

		return (
			<div className="panel padding-default" ref={ ref }>
				<div className={ wrapperCls }>
					<span className={ s.clickable } onClick={ this.clickMinusHandler }>–</span>
					<div className={ contentCls } onClick={ this.openMenu }>{ formatSum(value, currency) }</div>
					<span className={ s.clickable } onClick={ this.clickPlusHandler }>+</span>
				</div>
			</div>
		);
	};

	get options() {
		const { options, value, currency, onChange } = this.props;
		return (
			<ul>
				{options.map((item, idx) => {
					const isItemSelected = value === item;
					return (
						<li
							key={ idx }
							className={ s.dropDownItem }
							onClick={ () => this.onChange(item) }
						>
							{ formatSum(item, currency) }
							{ isItemSelected && (
								<div className={ s.selectedItemIcon }>
									<Icon type="checkmark" />
								</div>
							)}
						</li>
					);
				})}
			</ul>
		)
	}

	render() {
		const { isOpened } = this.state;

		return (
			<div>
				<div className="text-size-4 text-weight-bold margin-bottom-small">
					Страховая сумма
				</div>
				<Dropdown
					isOpened={ isOpened }
					target={ this.renderDropdownTarget }
					handleClose={ this.closeMenu }
					dropdownClass={ s.dropdownWrapper }
				>
					<Panel
						sections={ [
							this.options
						] }
						shadowLevel={ 3 }
						noPaddingContent
					/>
				</Dropdown>
			</div>
		);
	}
}

export default AmountSelect;
