var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../../dispatcher/dispatcher.js');
var UserStore = require('../../../stores/user-store.js');
var FormStore = require('../../../stores/form-store.js');
var ValidationStore = require('../../../stores/validation-store.js');
var PseudoTabs = require('react-ui').PseudoTabs;
var Tooltip = require('ui.tooltip');
var forEach = require('lodash/forEach');

module.exports = class extends React.Component {
	constructor(props) {
		super(props);
		this._update = this._update.bind(this);
		this._onChange = this._onChange.bind(this);
		this.state = {
			fieldName: FormStore.getFieldName('diagnostic_card'),
			fieldValues: FormStore.getDiagnosticCard(),
			tooltip: FormStore.getDiagnosticCardTooltip(),
			isFieldVisible: !UserStore.getDiagnosticCardCondition()
		}
	}
	componentDidMount() {
		UserStore.addChangeListener(this._update);
		this._initTooltips();
	}
	componentDidUpdate() {
		this._initTooltips();
	}
	componentWillUnmount() {
		UserStore.removeChangeListener(this._update);
	}
	_initTooltips() {
		if (!ReactDOM.findDOMNode(this)) {
			return;
		}

		var tooltips = ReactDOM.findDOMNode(this).querySelectorAll('*[data-tooltip]');

		forEach(tooltips, function(item) {
			new Tooltip($(item), {
				style: 'light',
				placement: 'top',
				content: item.getAttribute('data-content')
			});

			item.removeAttribute('data-tooltip');
		});
	}
	_onChange() {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'diagnostic_card',
			data: !this.props.data.diagnostic_card
		});
	}
	_update() {
		this.setState({isFieldVisible: !UserStore.getDiagnosticCardCondition()});
	}
	render() {
		if (this.props.data.type.osago) {
			ValidationStore.setField(['diagnostic_card']);

			if (this.state.isFieldVisible) {
				return (
					<div className="grid__row grid__row--align-center">
						<div className="grid__cell grid__cell--12 grid__cell--sm-4 font-bold">
							{ this.state.fieldName }
							<span className="form-row--title__tooltip">
								<i className="icon-font icon-hover icon-question-16" data-tooltip data-content={ this.state.tooltip }></i>
							</span>
						</div>
						<div className="grid__cell grid__cell--12 grid__cell--sm-8">
							<PseudoTabs
								name="diagnostic_card"
								testAttr="auto-diagnostic_card"
								items={ this.state.fieldValues }
								value={ this.props.data.diagnostic_card }
								onSelect={ this._onChange }
							/>
						</div>
					</div>
				)
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
};
