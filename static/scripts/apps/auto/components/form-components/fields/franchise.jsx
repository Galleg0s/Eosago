var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var Select = require('../../../../../_common/react-components/fields/select.jsx');
var Tooltip = require('ui.tooltip');
var forEach = require('lodash/forEach');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		var items = FormStore.getFranchises();
		var franchiseTooltip = FormStore.getFranchiseTooltip();
		this.state = {items: items, tooltip: franchiseTooltip}
	}

	componentDidMount() {
		this._initTooltips();
	}

	componentDidUpdate() {
		this._initTooltips();
	}

	_initTooltips() {
		if (!ReactDOM.findDOMNode(this)) {return;}

		var tooltips = ReactDOM.findDOMNode(this).querySelectorAll('*[data-tooltip]');

		forEach(tooltips, function(item) {
			new Tooltip($(item), {
				placement: 'top',
				content: item.getAttribute('data-content')
			});

			item.removeAttribute('data-tooltip');
		});
	}

	_onChange(name, value) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'franchise',
			data: value
		});
	}

	render() {
		if (this.props.data.type.kasko) {
			ValidationStore.setField(['franchise']);
			return (
				<div className="grid__row grid__row--align-center padding-top-default">
					<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">
						Франшиза
						<span className="form-row--title__tooltip">
							<i className="icon-font icon-hover icon-question" data-tooltip data-content={ this.state.tooltip } ></i>
						</span>
					</div>
					<div className="grid__cell grid__cell--12 grid__cell--sm-8" data-test="auto-franchise">
						<Select
							items={ this.state.items }
							onChange={ this._onChange }
							value={ this.props.data.franchise }
						/>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
};
