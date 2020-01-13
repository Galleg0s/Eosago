var React = require('react');
var UserStore = require('../../../stores/user-store.js');
var ValidationStore = require('../../../stores/validation-store.js');

module.exports = class extends React.Component {
	_onClickHandler() {
		UserStore.setTempRegionFieldName('region_registration');
	}

	render() {
		var field;

		ValidationStore.setField(['region_registration']);

		if (this.props.data.regionsAreEqual) {
			field = (
				<label className="title-checkbox">
					<input
						type="checkbox"
						className="modern-checkbox usr__trigger"
						onClick={ this._onClickHandler }
						checked={ true }
						readOnly
					/>
					<span className="checkbox-label">совпадает с регионом проживания</span>
				</label>
			);
		} else {
			field = (
				<span
					data-test="auto-region_registration"
					onClick={ this._onClickHandler }
					className="pseudo-link usr__trigger"
				>
					{ this.props.data.region_registration.title }
				</span>
			);
		}

		return (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Регион регистрации собственника</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8 field-text">
					{ field }
				</div>
			</div>
		)
	}
};
