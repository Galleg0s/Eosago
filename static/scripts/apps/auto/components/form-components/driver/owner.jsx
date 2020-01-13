var React = require('react');
var Input = require('../../../../../_common/react-components/fields/input.jsx');
var Select = require('../../../../../_common/react-components/fields/select.jsx');
var BirthdayField = require('./birthday.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this._onChangeWrapper = this._onChangeWrapper.bind(this)
	}
	_onChangeWrapper(name, value) {
		var fieldsMap = {
			'passport.series': 'passport.number'
		};

		this.props.onChange(name, value);

		if (Object.keys(fieldsMap).indexOf(name) !== -1) {
			if (value && value.length === 4) {
				this.refs[fieldsMap[name] + this.props.driverIndex].refs.input.focus();
			}
		}
	}

	render() {
		return (
			<div className="padding-default">
				<div className="grid__row">
					<div className="grid__cell font-bold">Собственник ТС</div>
				</div>
				<div className="border-bottom-dotted padding-top-default"></div>
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
				<div className="grid__row grid__row--align-center padding-top-default" data-hint={ 'passport' + this.props.driverIndex }>
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Паспорт</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<div className="grid__row grid__row--v-zero">
							<div className="grid__cell grid__cell--4">
								<Input
									name="passport.series"
									placeholder="серия"
									classes="input--full-width"
									testAttr="auto-passport-series"
									hintAttr={ 'passport.series' + this.props.driverIndex }
									value={ this.props.driver.passport.series }
									onChange={ this._onChangeWrapper }
									required="required"
									valid={ this.props.validation['passport.series'] }
									maxUnvalidationLength="4"
									pattern={ /[0-9]{1,4}/ }
								/>
							</div>
							<div className="grid__cell grid__cell--8">
								<Input
									ref={ 'passport.number' + this.props.driverIndex }
									name="passport.number"
									placeholder="номер"
									classes="input--full-width"
									testAttr="auto-passport-number"
									hintAttr={ 'passport.number' + this.props.driverIndex }
									value={ this.props.driver.passport.number }
									onChange={ this.props.onChange }
									required="required"
									valid={ this.props.validation['passport.number'] }
									maxUnvalidationLength="6"
									pattern={ /[0-9]{1,6}/ }
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">VIN номер ТС</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<Input
							name="vin"
							style={ {width: '170px'} }
							testAttr="auto-vin"
							hintAttr={ 'vin' + this.props.driverIndex }
							value={ this.props.driver.vin }
							onChange={ this.props.onChange }
							required="required"
							valid={ this.props.validation.vin }
							maxUnvalidationLength="17"
						/>
					</div>
				</div>
			</div>
		)
	}
};
