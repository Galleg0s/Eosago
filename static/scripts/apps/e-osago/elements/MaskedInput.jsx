import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery.inputmask';

class MaskedInput extends Component {
	componentDidMount() {
		this._initMaskedInput();
	}

	componentDidUpdate(prevProps) {
		if (this.props.value !== prevProps.value) {
			this._initMaskedInput();
			this.maskedInput.value = this.props.value || null;
		}
	}

	componentWillUnmount() {
		$(this.maskedInput).inputmask('remove');
	}

	_initMaskedInput() {
		const { casing, mask, onChange } = this.props;
		const $maskedInput = $(this.maskedInput);

		$maskedInput.inputmask({
			mask,
			oncomplete: (event) => {
				onChange(event);
			},
			onincomplete: (event) => {
				onChange(event);
			},
			showMaskOnHover: false,
			placeholder: ' ',
			greedy: false,
			casing,
			definitions: {
				v: {								/* Маска для VIN номера */
					validator: '[A-HJ-NPR-Za-hj-npr-z0-9]',	/* Цифры и заглавные латинские буквы */
					cardinality: 1,					/* Кроме: 'Q', 'I', 'O' */
				},
				g: {								/* Маска для букв гос. номера и номера СТС/ПТС  */
					validator: '[АВЕКМНОРСТУХавекмнорстух]',	/* Заглавные русские буквы схожие по написанию с латинскими: */
					cardinality: 1,					/* 'АВЕКМНОРСТУХ' */
				},
				p: {								/* Маска для возможных символов в поле номера СТС/РТС */
					validator: '[АВЕКМНОРСТУХавекмнорстух0-9]',	/* Заглавные русские буквы схожие по написанию с латинскими и цифры */
					cardinality: 1,
				},
				b: {
					validator: '[A-HJ-NPR-Za-hj-npr-z0-9\u0020\u002D]',
					cardinality: 1,
				}
			}
		});
	}

	render() {
		const { onChange, ...rest } = this.props;

		return (
			<input
				className="form-input-field"
				ref={ (input) => { this.maskedInput = input; } }
				onChange={ onChange }
				{ ...rest }
			/>
		);
	}
}

export default MaskedInput;
