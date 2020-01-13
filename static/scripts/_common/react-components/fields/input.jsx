var React = require('react');
var classNames = require('classnames');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: this.props.value,
			input: null,
			showError: this._showError(this.props.value, this.props.valid)
		}
	}

	componentDidMount() {
		this.setState({input: this.refs.input});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({showError: this._showError(nextProps.value, nextProps.valid)});
	}

	_showError(value, valid) {
		if (!this.props.required || !value) {return false;}

		var maxUnvalidationLength = parseInt(this.props.maxUnvalidationLength) || 1;

		if (!this.state || this.state.input === document.activeElement) {
			return value.toString().length < maxUnvalidationLength ? false : !valid;
		} else {
			return !valid;
		}
	}

	_onChange(name) {
		var value = this.state.input.value;
		var valueMatched = null;

		if (this.props.pattern) {
			valueMatched = value.match(this.props.pattern);

			if (valueMatched) {
				value = valueMatched[0];
				this.state.input.value = valueMatched[0];
			} else {
				value = '';
				this.state.input.value = '';
			}
		}

		if (this.props.onChange) {
			this.props.onChange(name, value);
		}
	}

	_onBlur() {
		this.setState({showError: this.props.required && !this.props.valid && this.props.value});
	}

	render() {
		var classes = classNames('form-input-field', this.props.classes, {error: this.state.showError});

		return (
			<span className={ this.props.containerClasses }>
				<input
					key="input"
					type={ this.props.type || 'text' }
					ref="input"
					value={ this.props.value || '' }
					className={ classes }
					data-test={ this.props.testAttr }
					data-hint={ this.props.hintAttr }
					data-name={ this.props.name }
					placeholder={ this.props.placeholder }
					onChange={ this._onChange.bind(this, this.props.name) }
					onBlur={ this._onBlur.bind(this, this.props.name) }
					style={ this.props.style }
				/>
				{this.state.showError && this.props.errorMessage ? <div key="message" className="error-message">{this.props.errorMessage}</div> : ''}
			</span>
		)
	}
};
