var React = require('react');
var FormStore = require('../../../stores/form-store.js');
var Input = require('../../../../../_common/react-components/fields/input.jsx');
var Select = require('../../../../../_common/react-components/fields/select.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var sex = FormStore.getSex();
		var marriage = FormStore.getMarriage();
		var children = FormStore.getChildren();

		this.state = {
			sex: sex,
			marriage: marriage,
			children: children
		};
	}

	render() {
		return (
			<div className="grid__row grid__row--h-lg padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--xl-4">
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
							<div className="grid__row grid__row--v-zero grid__row--align-center">
								<div className="grid__cell grid__cell--6 grid__cell--md-4 font-bold">Возраст</div>
								<Input
									type="number"
									name="age"
									containerClasses="grid__cell grid__cell--min"
									classes="input--centered-value"
									style={ {width: '70px'} }
									testAttr="auto-age-tab"
									hintAttr={ 'age' + this.props.driverIndex }
									value={ this.props.driver.age }
									onChange={ this.props.onChange }
									required="required"
									valid={ this.props.validation.age }
									maxUnvalidationLength="2"
								/>
								<span className="grid__cell">лет</span>
							</div>
						</div>
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
							<div className="grid__row grid__row--v-zero grid__row--align-center">
								<div className="grid__cell grid__cell--6 grid__cell--md-4 font-bold">Стаж</div>
								<Input
									type="number"
									name="experience"
									containerClasses="grid__cell grid__cell--min"
									classes="input--centered-value"
									style={ {width: '70px'} }
									testAttr="auto-experience-tab"
									hintAttr={ 'experience' + this.props.driverIndex }
									value={ this.props.driver.experience }
									onChange={ this.props.onChange }
									required="required"
									valid={ this.props.validation.experience }
								/>
								<span className="grid__cell">лет</span>
							</div>
						</div>
					</div>
				</div>
				<div className="grid__cell grid__cell--12 grid__cell--xl-4">
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
							<div className="grid__row grid__row--v-zero grid__row--align-center">
								<div className="grid__cell grid__cell--6 grid__cell--md-4 font-bold">Состоит в браке</div>
								<div className="grid__cell grid__cell--6 grid__cell--md-8" data-test="auto-marriage">
									<Select
										name="marriage"
										items={ this.state.marriage }
										value={ this.props.driver.marriage }
										onChange={ this.props.onChange }
									/>
								</div>
							</div>
						</div>
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
							<div className="grid__row grid__row--v-zero grid__row--align-center">
								<div className="grid__cell grid__cell--6 grid__cell--md-4 font-bold">Пол</div>
								<div className="grid__cell grid__cell--6 grid__cell--md-8" data-test="auto-sex">
									<Select
										name="sex"
										items={ this.state.sex }
										value={ this.props.driver.sex }
										onChange={ this.props.onChange }
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="grid__cell grid__cell--12 grid__cell--xl-4">
					<div className="grid__row">
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
							<div className="grid__row grid__row--v-zero grid__row--align-center">
								<div className="grid__cell grid__cell--6 grid__cell--md-4 font-bold">Наличие детей</div>
								<div className="grid__cell grid__cell--6 grid__cell--md-8" data-test="auto-children">
									<Select
										name="children"
										items={ this.state.children }
										value={ this.props.driver.children }
										onChange={ this.props.onChange }
									/>
								</div>
							</div>
						</div>
						<div className="grid__cell grid__cell--12 grid__cell--md-6 grid__cell--xl-12">
						</div>
					</div>
				</div>
			</div>
		)
	}
};
