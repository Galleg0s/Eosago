var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var ValidationStore = require('../../../stores/validation-store.js');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this)
	}
	_onChange() {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'warranty',
			data: !this.props.data.warranty
		});
	}

	render() {
		if (this.props.data.type.kasko) {
			ValidationStore.setField(['warranty']);

			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">ТС на гарантии</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8 field-text">
						<label className="title-checkbox">
							<input
								type="checkbox"
								className="modern-checkbox"
								onChange={ this._onChange }
								checked={ this.props.data.warranty }
							/>
							<span className="checkbox-label">да</span>
						</label>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
