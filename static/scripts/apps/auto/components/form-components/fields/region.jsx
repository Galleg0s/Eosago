var React = require('react');
var UserStore = require('../../../stores/user-store.js');
var ValidationStore = require('../../../stores/validation-store.js');

module.exports = class extends React.Component {
	render() {
		ValidationStore.setField(['region']);

		return (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Регион проживания</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8 field-text">
					<span
						data-test="auto-region"
						onClick={ UserStore.setTempRegionFieldName.bind(UserStore, 'region') }
						className="pseudo-link usr__trigger"
					>
						{ this.props.data.region.title }
					</span>
				</div>
			</div>
		);
	}
};
