var React = require('react');
var FormStore = require('../../../stores/form-store.js');
var Input = require('../../../../../_common/react-components/fields/input.jsx');
var Select = require('../../../../../_common/react-components/fields/select.jsx');
var BirthdayField = require('./birthday.jsx');
var IssueDateField = require('./issue-date.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		this._onChangeWrapper = this._onChangeWrapper.bind(this);
		var sex = FormStore.getSex();
		var marriage = FormStore.getMarriage();
		var children = FormStore.getChildren();
		this.state = {
			sex: sex,
			marriage: marriage,
			children: children
		}
	}

	_onChangeWrapper(name, value) {
		var fieldsMap = {
			'license.series': 'license.number'
		};

		this.props.onChange(name, value);

		if (Object.keys(fieldsMap).indexOf(name) !== -1) {
			if (value && value.length === 4) {
				this.refs[fieldsMap[name] + this.props.driverIndex].refs.input.focus();
			}
		}
	}

	render() {
		var SexField = (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Пол</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8">
					<Select
						name="sex"
						items={ this.state.sex }
						value={ this.props.driver.sex }
						onChange={ this.props.onChange }
					/>
				</div>
			</div>
		);

		var MerriageField = (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Состоит в браке</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="auto-marriage">
					<Select
						name="marriage"
						items={ this.state.marriage }
						value={ this.props.driver.marriage }
						onChange={ this.props.onChange }
					/>
				</div>
			</div>
		);

		var ChildrenField = (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Наличие детей</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="auto-children">
					<Select
						name="children"
						items={ this.state.children }
						value={ this.props.driver.children }
						onChange={ this.props.onChange }
					/>
				</div>
			</div>
		);

		return (
			<div>
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Фамилия</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<Input
							name="lastname"
							style={ {width: '170px'} }
							testAttr="auto-lastname"
							hintAttr={ 'lastname' + this.props.driverIndex }
							value={ this.props.driver.lastname }
							onChange={ this.props.onChange }
							required="required"
							valid={ this.props.validation.lastname }
							errorMessage="Фамилия может содержать русские буквы, пробел и дефис"
						/>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Имя</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<Input
							name="firstname"
							style={ {width: '170px'} }
							testAttr="auto-firstname"
							hintAttr={ 'firstname' + this.props.driverIndex }
							value={ this.props.driver.firstname }
							onChange={ this.props.onChange }
							required="required"
							valid={ this.props.validation.firstname }
							errorMessage="Имя может содержать русские буквы, пробел и дефис"
						/>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Отчество</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<Input
							name="surname"
							style={ {width: '170px'} }
							testAttr="auto-surname"
							hintAttr={ 'surname' + this.props.driverIndex }
							value={ this.props.driver.surname }
							onChange={ this.props.onChange }
							required="required"
							valid={ this.props.validation.surname }
							errorMessage="Отчество может содержать русские буквы, пробел и дефис"
						/>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default" data-hint={ 'birthday' + this.props.driverIndex }>
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Дата рождения</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<BirthdayField
							value={ this.props.driver.birthday }
							onChange={ this.props.onChange }
						/>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default" data-hint={ 'license' + this.props.driverIndex }>
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Водительское удостоверение</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<div className="grid__row grid__row--v-zero">
							<div className="grid__cell grid__cell--4">
								<Input
									name="license.series"
									classes="input--full-width"
									testAttr="auto-license-series"
									hintAttr={ 'license.series' + this.props.driverIndex }
									value={ this.props.driver.license.series }
									placeholder="серия"
									onChange={ this._onChangeWrapper }
									required="required"
									valid={ this.props.validation['license.series'] }
									maxUnvalidationLength="4"
									pattern={ /[0-9а-яА-Яa-zA-Z]{1,4}/ }
								/>
							</div>
							<div className="grid__cell grid__cell--8">
								<Input
									ref={ 'license.number' + this.props.driverIndex }
									name="license.number"
									classes="input--full-width"
									testAttr="auto-license-number"
									hintAttr={ 'license.number' + this.props.driverIndex }
									value={ this.props.driver.license.number }
									placeholder="номер"
									onChange={ this.props.onChange }
									required="required"
									valid={ this.props.validation['license.number'] }
									maxUnvalidationLength="6"
									pattern={ /[0-9]{1,6}/ }
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default" data-hint={ 'issue_date' + this.props.driverIndex }>
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Дата выдачи первых прав</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<IssueDateField
							value={ this.props.driver.issue_date }
							dependencies={ {birthday: this.props.driver.birthday} }
							onChange={ this.props.onChange }
						/>
					</div>
				</div>
				{ this.props.type.kasko ? SexField : null }
				{ this.props.type.kasko ? MerriageField : null }
				{ this.props.type.kasko ? ChildrenField : null }
			</div>
		)
	}
};
