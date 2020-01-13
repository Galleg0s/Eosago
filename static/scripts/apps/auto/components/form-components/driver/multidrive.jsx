var React = require('react');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var PseudoTabs = require('react-ui').PseudoTabs;

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		var items = FormStore.getMultidrive();
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
		ValidationStore.setField(['multidrive']);

		return (
			<div className="grid__row grid__row--align-center padding-top-default">
				<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">Количество водителей</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-8">
					<PseudoTabs
						name="multidrive"
						testAttr="auto-multidrive"
						items={ this.state.items }
						value={ this.props.data.multidrive }
						onSelect={ this._onSelect }
					/>
				</div>
			</div>
		)
	}
};
