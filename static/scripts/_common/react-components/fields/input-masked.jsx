var React = require('react');
var $ = require('jquery');
require('jquery.inputmask');

module.exports = class extends React.Component {
	componentDidMount() {
		var _self = this;
		var $maskedInput = $(_self.refs.maskedInput);

		if (_self.props.value) {
			$maskedInput.val(_self.props.value);
		}

		$maskedInput.inputmask({
			mask: _self.props.mask,
			clearMaskOnLostFocus: false,
			oncomplete: function() {
				_self.props.onChange($maskedInput.inputmask('unmaskedvalue'));
			},
			onincomplete: function() {
				_self.props.onChange(null);
			},
			onKeyDown: function() {
				if (!$maskedInput.inputmask('isComplete')) {
					_self.props.onChange(null);
				}
			}
		});
	}
	componentWillUnmount() {
		var _self = this;
		var $maskedInput = $(_self.refs.maskedInput);

		$maskedInput.inputmask('remove');
	}
	render() {
		return (
			<input ref="maskedInput" type="text" className="form-input-field input--full-width" />
		);
	}
};
