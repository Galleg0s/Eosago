var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var extend = require('lodash/extend');
var Select = require('ui.select');

module.exports = class extends React.Component {
	componentDidMount() {
		if (ReactDOM.findDOMNode(this).querySelector('[data-select]')) {
			this._initSelect();
		}
	}

	componentDidUpdate() {
		if (ReactDOM.findDOMNode(this).querySelector('[data-select]')) {
			this._initSelect();
		}
	}

	_initSelect() {
		var self = this;
		var selectInitialized = ReactDOM.findDOMNode(this).querySelector('.ui-select');
		var defaultOptions = {
			type: 'select',
			$toggler: $(ReactDOM.findDOMNode(this).querySelector('[data-select]')),
			onItemSelect: function(selected) {
				if (self.props.onChange && selected.length) {
					self.props.onChange(self.props.name, selected[0].id);
				}
			}
		};

		if (!selectInitialized) {
			new Select(extend(defaultOptions, this.props.optionsExtended));
		}
	}

	render() {
		var self = this;

		if (this.props.custom) {
			return (
				<span>
					<div data-select></div>
				</span>
			)
		} else {
			var options = this.props.items.map(function(option) {
				return <option value={ option.value } key={ option.value }>{ option.title }</option>;
			});

			return (
				<span>
					<select defaultValue={ this.props.value } tabIndex="-1" data-select>
						{options}
					</select>
				</span>
			)
		}
	}
};
