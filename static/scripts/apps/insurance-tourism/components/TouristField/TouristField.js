import React, { Component } from 'react';
import T from 'prop-types';
// import InputMask from 'react-input-mask';
import { Input, Icon } from 'react-ui-2018';
import InputMask from '../InputMask/InputMask';
import s from './TouristField.module.styl';

class TouristField extends Component {
	static propTypes = {
		className: T.string,
		id: T.string,
		input: T.shape().isRequired,
		canRemove: T.bool,
		shouldFocusOnMount: T.bool,
	};

	static defaultProps = {
		id: null,
		className: null,
		canRemove: true,
		shouldFocusOnMount: false,
	};

	componentDidMount() {
		const { shouldFocusOnMount } = this.props;
		if (this.inputRef && shouldFocusOnMount) {
			this.inputRef.focusElement();
		}
	}

	onInputRef = ref => {
		this.inputRef = ref;
	};

	get removeBtn() {
		const { canRemove, onRemove } = this.props;
		if (!canRemove) {
			return null;
		}
		return (
			<span className={ s.removeIcon }>
				<Icon
					type="close"
					size="medium"
					onClick={ this.props.onRemove }
				/>
			</span>
		);
	}

	render() {
		const { input, id } = this.props;
		return (
			<div className="flexbox flexbox--row flexbox--align-items_center flexbox--gap_small">
				<label htmlFor={ id }>Возраст</label>
				<div style={ { width: 80 } }>
					<InputMask
						min="0"
						max="99"
						mask="99"
						maskChar={ null }
						type="tel"
						onRef={ this.onInputRef }
						{ ...input }
					/>
				</div>
				{this.removeBtn}
			</div>
		);
	}
}

export default TouristField;
