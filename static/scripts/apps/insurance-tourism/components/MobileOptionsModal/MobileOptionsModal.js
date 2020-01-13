import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Icon,
	SelectionList, Button,
} from 'react-ui-2018';
import Category from './Category';
import {
	createOptionsSelector,
	searchParametersSelector,
	searchPolicies,
	sortSelectedOptions,
	updateSearchParameters
} from '../../redux/modules/search';
import { optionType } from '../../types';
import s from './MobileOptionsModal.module.styl';
import { emptyFunction } from '../../utils/utils';

const categories = [
	{
		id: 'health',
		title: 'Страхование здоровья',
		leftIconType: 'heart-40',
		description: 'Добавьте дополнительные опции, чтобы сделать вашу поездку максимально защищенной.',
		optionType: 'optionsSubrisk'
	},
	{
		id: 'sport',
		title: 'Спорт и активный отдых',
		leftIconType: 'sport',
		description: 'Любительский спорт',
		optionType: 'optionsSport'
	}
];

const routes = {
	categories: 'categories',
	health: 'health',
	sport: 'sport',
};

class MobileOptionsModal extends Component {
	static propTypes = {
		isOpen: T.bool,
		onRequestClose: T.func,
		sportOptions: T.arrayOf(optionType),
		healthOptions: T.arrayOf(optionType),
		searchParameters: T.shape,
		sortSelectedOptions: T.func.isRequired,
		searchPolicies: T.func.isRequired,
		updateSearchParameters: T.func.isRequired
	};

	static defaultProps = {
		isOpen: false,
		handleFilter: emptyFunction
	};

	state = {
		currentContent: routes.categories,
		selectedOptions: [],
	};

	componentDidUpdate(prevProps) {
		const { isOpen, searchParameters } = this.props;
		if (!prevProps.isOpen && isOpen) {
			this.setState({
				selectedOptions: searchParameters.options
			});
		}
	}

	onClose = () => {
		const { onRequestClose } = this.props;
		if (onRequestClose) {
			onRequestClose();
			this.resetValues();
		}
	};

	resetValues = () => {
		this.setState({ selectedOptions: this.props.searchParameters.options, currentContent: routes.categories });
	};

	onBack = () => {
		this.setState({
			currentContent: routes.categories
		})
	};

	showCategory = (categoryId) => {
		this.setState({
			currentContent: categoryId
		})
	};

	clearSelected = () => {
		this.setState({
			selectedOptions: []
		});
	};

	chooseButtonClick = () => {
		const { searchParameters, searchPolicies, updateSearchParameters, sortSelectedOptions } = this.props;
		const { selectedOptions: options } = this.state;
		categories.map(i => sortSelectedOptions(i.optionType, options));
		searchPolicies({
			...searchParameters,
			options,
		});
		updateSearchParameters({ options });
		this.onClose();
	};

	onOptionsSelect = selectedOptions =>
		this.setState({ selectedOptions });

	selectedOptionsCount(type) {
		const { selectedOptions } = this.state;
		const { sportOptions, healthOptions } = this.props;
		if (!selectedOptions || !selectedOptions.length) {
			return 0;
		}
		let options;
		switch (type) {
			case routes.sport:
				options = sportOptions;
				break;
			case routes.health:
				options = healthOptions;
				break;
			default:
				options = []
		}

		return options.filter(i => selectedOptions.includes(i.id)).length;
	}

	get optionsCategories() {
		return categories.map(item => (
			<Category
				selectedCount={ this.selectedOptionsCount(item.id) }
				category={ item }
				onCategoryClick={ this.showCategory }
			/>
		));
	}

	options(type) {
		const { sportOptions, healthOptions } = this.props;
		let options;
		switch (type) {
			case routes.sport:
				options = sportOptions;
				break;
			case routes.health:
				options = healthOptions;
				break;
			default:
				return null;
		}

		return (
			<div className={ s.options }>
				<SelectionList
					onChange={ this.onOptionsSelect }
					value={ this.state.selectedOptions }
					isMobile
					noBorder
				>
					{ options.map(option => (
						<SelectionList.Item
							key={ option.id }
							title={ option.displayName }
							value={ option.id }
							description={ option.comment }
						/>
					)) }
				</SelectionList>
			</div>
		);
	}

	get sport() {
		const sportCategory = categories.find(i => i.id === routes.sport);
		return (
			<Fragment>
				<Category
					selectedCount={ this.selectedOptionsCount(sportCategory.id) }
					category={ sportCategory }
					onCategoryClick={ this.onBack }
					isSelected={ true }
				/>
				{ this.options('sport') }
			</Fragment>
		);
	}

	get health() {
		const healthCategory = categories.find(i => i.id === routes.health);
		return (
			<Fragment>
				<Category
					selectedCount={ this.selectedOptionsCount(healthCategory.id) }
					category={ healthCategory }
					onCategoryClick={ this.onBack }
					isSelected={ true }
				/>
				{ this.options('health') }
			</Fragment>
		);
	}

	get modalContent() {
		switch (this.state.currentContent) {
			case routes.categories:
				return this.optionsCategories;
			case routes.health:
				return this.health;
			case routes.sport:
				return this.sport;
			default:
				return null
		}
	}

	render() {
		const { isOpen } = this.props;
		const { currentContent } = this.state;

		return (
			<Modal
				isOpen={ isOpen }
				width="100%"
				closeHandler={ this.onClose }
				onRequestClose={ this.onClose }
				isCloseIcon
				sticky
				isBackIcon={ currentContent !== routes.categories }
				backHandler={ this.onBack }
			>
				<ModalHeader>
					<div
						className="text-align-center text-size-3"
						style={ {
							'padding-left': 28		// Внимание костыль
						} }
					>
						Фильтр
					</div>
				</ModalHeader>
				<ModalBody>
					<div className="margin-left-anti margin-right-anti">
						{ this.modalContent }
					</div>
				</ModalBody>
				<ModalFooter>
					<div className="flexbox flexbox--row flexbox--gap_small">
						<div className="flexbox__item">
							<Button
								onClick={ this.chooseButtonClick }
								theme="blue"
								fullWidth
							>
								Найти
							</Button>
						</div>
						<div className="flexbox__item">
							<Button
								onClick={ this.clearSelected }
								theme="transparent-light"
								fullWidth
							>
								Очистить
							</Button>
						</div>
					</div>
				</ModalFooter>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	const sportOptionsSelector = createOptionsSelector('optionsSport');
	const healthOptionsSelector = createOptionsSelector('optionsSubrisk');
	return {
		sportOptions: sportOptionsSelector(state),
		healthOptions: healthOptionsSelector(state),
		searchParameters: searchParametersSelector(state),
	};
}

export default connect(mapStateToProps, {
	searchPolicies,
	updateSearchParameters,
	sortSelectedOptions
})(MobileOptionsModal);

