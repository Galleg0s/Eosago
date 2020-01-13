var React = require('react');
var Input = require('../../../../../_common/react-components/fields/input.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="grid__row grid__row--h-lg padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-6">
					<div className="grid__row grid__row--align-center">
						<div className="grid__cell grid__cell--12 grid__cell--md-4 font-bold">Возраст</div>
						<div className="grid__cell grid__cell--12 grid__cell--md-8">
							<Input
								name="age_tab"
								classes="input--full-width"
								testAttr="auto-age-tab"
								hintAttr={ 'age_tab' + this.props.driverIndex }
								value={ this.props.driver.age_tab }
								onChange={ this.props.onChange }
								required="required"
								maxUnvalidationLength="3"
								pattern={ /[0-9]{1,2}/ }
								valid={ this.props.validation.age_tab }
							/>
						</div>
					</div>
				</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-6">
					<div className="grid__row grid__row--align-center">
						<div className="grid__cell grid__cell--12 grid__cell--md-4 font-bold">Стаж вождения</div>
						<div className="grid__cell grid__cell--12 grid__cell--md-8">
							<Input
								name="experience_tab"
								classes="input--full-width"
								testAttr="auto-experience-tab"
								hintAttr={ 'experience_tab' + this.props.driverIndex }
								value={ this.props.driver.experience_tab }
								onChange={ this.props.onChange }
								required="required"
								maxUnvalidationLength="3"
								pattern={ /[0-9]{1,2}/ }
								valid={ this.props.validation.experience_tab }
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
};
