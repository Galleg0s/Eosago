import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import { UnmountClosed } from 'react-collapse';
import cx from 'classnames';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Icon,
} from 'react-ui-2018';
import s from './MobileOptionsModal.module.styl';
import { emptyFunction } from '../../utils/utils';

class Category extends Component {
	static propTypes = {
		category: T.shape({
			id: T.string,
			title: T.string,
			leftIconType: T.string,
			description: T.string,
		}).isRequired,
		onCategoryClick: T.func,
		isSelected: T.bool,
		selectedCount: T.number
	};

	static defaultProps = {
		onCategoryClick: emptyFunction,
	};

	state = {
		isDescriptionOpen: false,
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { isSelected } = prevProps;
		if (!this.props.isSelected && isSelected) {
			this.setState({
				isDescriptionOpen: false
			})
		}
	}

	toggleDescription = (e) => {
		e.stopPropagation();
		this.setState(prevState => ({ isDescriptionOpen: !prevState.isDescriptionOpen }));
	};

	clickCategory = () => {
		const { onCategoryClick, category: { id } } = this.props;
		this.setState({
			isDescriptionOpen: false
		});
		onCategoryClick(id);
	};

	render() {
		const { isSelected, selectedCount } = this.props;
		const { title, leftIconType, description } = this.props.category;
		const { isDescriptionOpen } = this.state;
		const wrapperClasses = cx(s.wrapper, {
			'shadow-level-4': isDescriptionOpen,
			[s.stickyCategory]: isSelected,
		});

		return (
			<div className={ wrapperClasses }>
				<div
					onClick={ this.clickCategory }
					className={ cx('flexbox flexbox--row flexbox--align-items_center flexbox--justify-content_center', s.category, {
						'bg-major-dark-blue': isSelected,
						'bg-minor-gray-lighten2': selectedCount !== 0 && !isSelected
					}) }
				>
					<Icon
						size="xlarge"
						type={ leftIconType }
						color={ isSelected ? 'white' : 'major-dark-blue' }
						className="flexbox__item flexbox__item--min"
					/>
					<div
						className={ cx('flexbox__item margin-left-small-fixed text-weight-medium text-size-6', {
							'color-white': isSelected
						}) }
					>
						<div>{ title }</div>
						{ selectedCount !== 0 &&
							<div
								className={ cx('margin-top-xx-small text-note', {
									'color-white-alpha-20': isSelected
								}) }
							>
								{ `Выбрано: ${ selectedCount }` }
							</div>
						}
					</div>
					<Icon
						size="medium"
						type="info"
						color="major-grey"
						className="flexbox__item flexbox__item--min"
						onClick={ this.toggleDescription }
					/>
				</div>
				<UnmountClosed isOpened={ isDescriptionOpen }>
					<div className="text-size-7 padding-small-fixed bg-white">
						{ description }
					</div>
				</UnmountClosed>
			</div>
		);
	}
}

export default Category;
