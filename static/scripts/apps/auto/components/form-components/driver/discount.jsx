var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var RadioButtonList = require('react-ui').RadioButtonList;

class AutoFormDriversDiscount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: FormStore.getAccidentFree(),
			info: FormStore.getAccidentFreeInfo(),
			fieldName: FormStore.getFieldName('accident_free')
		}
	}

	_onSelect(value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'accident_free',
			data: value
		});
	}

	render() {
		if (this.props.data.type.osago && !this.props.data.first_osago) {
			ValidationStore.setField(['accident_free']);

			return (
				<div className="grid__row padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">{this.state.fieldName}</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="auto-accident-free">
						<RadioButtonList
							items={ this.state.items }
							containerClasses="grid__cell grid__cell--12"
							value={ this.props.data.accident_free }
							name="accidentFree"
							onSelect={ this._onSelect }
						/>
						<div className="grid__row padding-top-default">
							<div className="grid__cell grid__cell--12">{ this.state.info }</div>
						</div>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
}

module.exports = AutoFormDriversDiscount;
