var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var PseudoTabs = require('react-ui').PseudoTabs;

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = FormStore.getFirstOsago();
		this.state = {items: items}
	}

	_onSelect(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: name,
			data: value
		});
	}

	render() {
		if (this.props.data.type.osago) {
			ValidationStore.setField(['first_osago']);

			return (
				<div className="grid__row grid__row--align-center">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Оформляю ОСАГО впервые</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8">
						<PseudoTabs
							name="first_osago"
							testAttr="auto-first-osago"
							items={ this.state.items }
							value={ this.props.data.first_osago }
							onSelect={ this._onSelect }
						/>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
