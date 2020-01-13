import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { applyContainerQuery } from 'react-container-query';
import { Button, Icon, Tooltip } from 'react-ui-2018';
import CountriesField from '../CountriesField/CountriesField';
import CheckboxField from '../CheckboxField/CheckboxField';
import TouristsArrayField from '../TouristsArrayField/TouristsArrayField';
import InputDropdownField from '../InputDropdownField/InputDropdownField';
import DatePickerField from '../DatePickerField/DatePickerField';
import {
	SEARCH_FORM_NAME,
	popularCountriesSelector,
	otherCountriesSelector,
	searchParametersSelector,
	searchFormValuesSelector,
} from '../../redux/modules/search';
import { optionType } from '../../types';
import validate from './validate';
import s from './SearchForm.module.styl';

const onFormChange = (values, dispatch, { onFormChange }) => {
	if (onFormChange) {
		onFormChange(values);
	}
};

function onSubmit(values, dispatch, { onFormSubmit }) {
	if (onFormSubmit) {
		onFormSubmit(values);
	}
}

const insuranceDaysCountArray = [
	{ id: 0, content: 30 },
	{ id: 1, content: 45 },
	{ id: 2, content: 60 },
	{ id: 3, content: 90 },
	{ id: 4, content: 180 },
	{ id: 5, content: 365 },
];

const query = {
	lg: {
		minWidth: 1216
	},
	md: {
		maxWidth: 1215,
		minWidth: 960,
	},
	sm: {
		maxWidth: 959,
		minWidth: 680,
	},
	hxs: {
		maxWidth: 679,
		minWidth: 496
	},
	xs: {
		maxWidth: 495,
	},
};

const insuranceDaysCountLabel = (
	<Fragment>
		Период

		<Tooltip
			content="Количество застрахованных дней в течение года"
			position="top"
		>
			<span className="margin-left-x-small" style={ {position: 'absolute'} }>
				<Icon
					type="info"
					size="medium"
					saturate
				/>
			</span>
		</Tooltip>
	</Fragment>
);

class SearchForm extends Component {
	static propTypes = {
		className: T.string,
		handleSubmit: T.func.isRequired,
		hasForeigners: T.bool,
		countriesSuggestions: T.arrayOf(
			T.shape()
		),
		selectedOptions: T.arrayOf(optionType),
		isAjax: T.bool,
		containerQuery: T.shape(),
		onSubmit: T.func,
		onDatesChange: T.func,
		onCountryChange: T.func,
	};

	static defaultProps = {
		className: null,
		hasForeigners: false,
		countriesSuggestions: [],
		selectedOptions: [],
		isAjax: false,
		containerQuery: {},
	};

	onYearPolicyChange = () => {
		this.props.clearFields(false, false, 'dates', 'insuranceDaysCount');
	};

	get fieldsSize() {
		const { xs, hxs } = this.props.containerQuery;
		if (xs || hxs) {
			return 'medium';
		}
		return 'large';
	}

	componentDidMount() {
		// Событие на прогрузку виджета (на прогрузку кнопки Найти страховку)
		if (!this.props.isResultPage) {
			pushGtmEvent('VZR_SERVIS', 'download_servis', undefined, undefined, true);
		}
	}

	componentWillReceiveProps(nextProps) {

		// событие на клик “годовой полис”
		if (this.props.yearPolicy !== undefined && nextProps.yearPolicy != this.props.yearPolicy) {
			pushGtmEvent('VZR_SERVIS', 'click_godovoj_polis', undefined, undefined);
		}

		// событие на клик “иностранные граждане”
		if (nextProps.hasForeigners != this.props.hasForeigners) {
			pushGtmEvent('VZR_SERVIS', 'click_inostrancy', undefined, undefined);
		}
	}

	get insuranceDaysCount() {
		const { yearPolicy } = this.props;
		if (!yearPolicy) {
			return null;
		}
		return (
			<div className="flexbox__item flexbox__item--min">
				<div className={ s.daysCountField }>
					<Field
						id="insuranceDaysCount"
						name="insuranceDaysCount"
						label={ insuranceDaysCountLabel }
						items={ insuranceDaysCountArray }
						size={ this.fieldsSize }
						component={ InputDropdownField }
					/>
				</div>
			</div>
		);
	}

	get yearPolicyCheckbox() {
		return (
			<Field
				id="yearPolicy"
				name="yearPolicy"
				title="Годовой полис"
				component={ CheckboxField }
				onChange={ this.onYearPolicyChange }
			/>
		);
	}

	get datePicker() {
		const { yearPolicy, containerQuery } = this.props;
		const { lg, md, sm } = containerQuery;
		const size = this.fieldsSize;
		if (yearPolicy) {
			return (
				<div>
					<Field
						id="dates"
						name="dates"
						label="Дата поездки"
						type="single"
						component={ DatePickerField }
						size={ size }
					/>
				</div>
			);
		}
		return (
			<Field
				id="dates"
				name="dates"
				label="Дата поездки"
				type="range"
				placeholder="Выберите даты поездки"
				component={ DatePickerField }
				size={ size }
				onChange={ this.props.onDatesChange }
				doubleMonth={ lg || md || sm }
			/>
		);
	}

	get submitBtn() {
		const { isResultPage, containerQuery, dirty } = this.props;
		const { xs, hxs, lg } = containerQuery;
		const btn = {
			def: {
				title: 'Найти страховку',
				theme: 'blue'
			},
			recalc: {
				title: 'Пересчитать',
				theme: 'green'
			}
		};
		let key = 'def';
		if (isResultPage && dirty) {
			key = 'recalc';
		}

		return (
			<Button
				type="submit"
				size="large"
				theme={ btn[key].theme }
				fullWidth={ xs || hxs || lg }
			>
				{ btn[key].title }
			</Button>
		);
	}

	get countriesField() {
		const { countriesSuggestions, onCountryChange } = this.props;
		return (
			<Field
				label="Страна поездки"
				id="countries"
				name="countries"
				size={ this.fieldsSize }
				component={ CountriesField }
				suggestions={ countriesSuggestions }
				onChange={ onCountryChange }
			/>
		);
	}

	get touristsField() {
		const { hasForeigners } = this.props;
		return (
			<FieldArray
				label="Туристы"
				name="tourists"
				size={ this.fieldsSize }
				component={ TouristsArrayField }
				hasForeigners={ hasForeigners }
			/>
		);
	}

	get xsForm() {
		return (
			<div className="panel bg-white">
				<div className="panel__section padding-small-fixed">
					<div className="margin-bottom-small-fixed">
						{this.countriesField}
					</div>
					<div className="margin-bottom-small-fixed">
						<div className="flexbox flexbox--row flexbox--gap_small">
							<div className="flexbox__item">
								{this.datePicker}
							</div>
							{this.insuranceDaysCount}
						</div>
						<div className="margin-top-x-small-fixed">
							{this.yearPolicyCheckbox}
						</div>
					</div>
					{this.touristsField}
				</div>
				<div className="panel__section text-align-center">
					<div className="padding-small-fixed">
						{this.submitBtn}
					</div>
				</div>
			</div>
		);
	}

	get hxsForm() {
		return (
			<div className="panel bg-white">
				<div className="panel__section padding-small-fixed">
					<div className="margin-bottom-small-fixed">
						{this.countriesField}
					</div>
					<div className="flexbox flexbox--row flexbox--gap_small flexbox--align-items_flex-start">
						<div className="flexbox__item">
							<div className="flexbox flexbox--row flexbox--gap_small">
								<div className="flexbox__item">
									{this.datePicker}
								</div>
								{this.insuranceDaysCount}
							</div>
							<div className="margin-top-x-small">
								{this.yearPolicyCheckbox}
							</div>
						</div>
						<div className="flexbox__item flexbox__item--min">
							{this.touristsField}
						</div>
					</div>
				</div>
				<div className="panel__section text-align-center">
					<div className="padding-small-fixed">
						{this.submitBtn}
					</div>
				</div>
			</div>
		);
	}

	get smForm() {
		return (
			<div className="panel bg-white">
				<div className="panel__section padding-default">
					<div className="margin-bottom-medium">
						{this.countriesField}
					</div>
					<div className="flexbox flexbox--row flexbox--gap_medium flexbox--align-items_flex-start">
						<div className="flexbox__item">
							<div className="flexbox flexbox--row flexbox--gap_medium">
								<div className="flexbox__item">
									{this.datePicker}
								</div>
								{this.insuranceDaysCount}
							</div>
							<div className="margin-top-x-small">
								{this.yearPolicyCheckbox}
							</div>
						</div>
						<div className="flexbox__item">
							{this.touristsField}
						</div>
					</div>
				</div>
				<div className="panel__section text-align-center">
					<div className="padding-medium">
						{this.submitBtn}
					</div>
				</div>
			</div>
		);
	}

	get mdForm() {
		return (
			<div className="panel bg-white">
				<div className="panel__section padding-default">
					<div className="flexbox flexbox--row flexbox--gap_medium flexbox--align-items_flex-start">
						<div className={ cx(s.countriesField, 'flexbox__item') }>
							{this.countriesField}
						</div>
						<div className={ cx(s.datesField, 'flexbox__item') }>
							<div className="flexbox flexbox--row flexbox--gap_medium">
								<div className="flexbox__item">
									{this.datePicker}
								</div>
								{this.insuranceDaysCount}
							</div>
							<div className="margin-top-x-small">
								{this.yearPolicyCheckbox}
							</div>
						</div>
						<div className={ `${s.touristsField} flexbox__item flexbox__item--min` }>
							{this.touristsField}
						</div>
					</div>
				</div>
				<div className="panel__section text-align-center">
					<div className="padding-medium">
						{this.submitBtn}
					</div>
				</div>
			</div>
		);
	}

	get lgForm() {
		return (
			<div className="panel bg-white padding-default">
				<div className="flexbox flexbox--row flexbox--gap_medium flexbox--align-items_flex-start">
					<div className={ cx(s.countriesField, 'flexbox__item') }>
						{this.countriesField}
						{/* <Field*/}
						{/* name="alreadyTravelling"*/}
						{/* title="Уже путешествую"*/}
						{/* type="date"*/}
						{/* component={ CheckboxField }*/}
						{/* />*/}
					</div>
					<div className={ cx(s.datesField, 'flexbox__item') }>
						<div className="flexbox flexbox--row flexbox--gap_medium">
							<div className="flexbox__item">
								{this.datePicker}
							</div>
							{this.insuranceDaysCount}
						</div>
						<div className="margin-top-x-small">
							{this.yearPolicyCheckbox}
						</div>
					</div>
					<div className={ `${s.touristsField} flexbox__item flexbox__item--min` }>
						{this.touristsField}
					</div>
					<div className={ `${s.submit} flexbox__item flexbox__item--min` }>
						{this.submitBtn}
					</div>
				</div>
			</div>
		);
	}

	get formContent() {
		const { xs, hxs, sm, md, lg } = this.props.containerQuery;
		if (lg) {
			return this.lgForm;
		}
		if (md) {
			return this.mdForm;
		}
		if (sm) {
			return this.smForm;
		}
		if (hxs) {
			return this.hxsForm;
		}
		if (xs) {
			return this.xsForm;
		}
		return null;
	}

	render() {
		const {
			className,
			handleSubmit,
		} = this.props;

		return (
			<form
				className={ className }
				onSubmit={ handleSubmit }
				autoComplete="off"
			>
				{this.formContent}
			</form>
		);
	}
}

function mapStateToProps(state) {
	const { countries, dates, tourists, yearPolicy, insuranceDaysCount, exchangeLink } = searchParametersSelector(state);
	return {
		hasForeigners: searchFormValuesSelector(state, 'foreigners'),
		dates: searchFormValuesSelector(state, 'dates'),
		insuranceDaysCount: searchFormValuesSelector(state, 'insuranceDaysCount'),
		yearPolicy: searchFormValuesSelector(state, 'yearPolicy'),
		countriesSuggestions: [
			{ options: popularCountriesSelector(state) },
			{ options: otherCountriesSelector(state) },
		],
		initialValues: {
			countries,
			dates,
			tourists: tourists && tourists.length ? tourists : [{}],
			yearPolicy,
			insuranceDaysCount,
			exchangeLink,
		},
	};
}

export default connect(mapStateToProps)(
	reduxForm({
		form: SEARCH_FORM_NAME,
		onChange: onFormChange,
		validate,
		onSubmit,
	})(
		applyContainerQuery(SearchForm, query),
	),
);
