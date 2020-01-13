import React, { Component } from 'react';
import Autosuggest, {
	ChangeEvent,
	RenderSuggestionsContainerParams,
	SuggestionSelectedEventData,
	SuggestionsFetchRequestedParams
} from 'react-autosuggest';
import { Scrollbars } from 'react-custom-scrollbars';
import {WrappedFieldProps} from 'redux-form';
import { Input, FormField } from 'react-ui-2018';
import theme from './AutosuggestInput.module.styl';
import {BrandEntity, ModelEntity} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';
import {getValidationStatus} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/utils';

export type SuggestionEntity = BrandEntity | ModelEntity;

export interface AutosuggestInputProps extends WrappedFieldProps {
	data: SuggestionEntity[]
}

export interface AutosuggestInputState {
	value: string,
	suggestions: SuggestionEntity[]
}

function getSuggestionValue(suggestion: SuggestionEntity) {
	return suggestion.name;
}

function renderSuggestion(suggestion: SuggestionEntity) {
	return suggestion.name;
}

const alwaysTrue = () => true;

function escapeRegexCharacters(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class AutosuggestInput extends Component<AutosuggestInputProps, AutosuggestInputState> {
	state = {
		value: '',
		suggestions: []
	};

	componentDidMount(): void {
		const {
			input: {
				value
			}
		} = this.props;
		if (value) {
			this.setState({ value: this.getValue(value) });
		}
	}

	componentDidUpdate(prevProps: AutosuggestInputProps): void {
		const {
			value
		} = this.props.input;

		if (prevProps.input.value !== value || !prevProps.data.length && this.props.data.length) {
			this.updateValue();
		}
	}

	getValue(id: number) {
		const currEntity = this.props.data.find((item) => item.id === id);
		return currEntity ? currEntity.name : '';
	}

	getSuggestions(value: string) {
		const escapedValue = value && escapeRegexCharacters(value.trim());
		if (!escapedValue || escapedValue === this.state.value) {
			return this.props.data;
		}
		const regex = new RegExp('^' + escapedValue, 'i');
		return this.props.data.filter((entity: SuggestionEntity) => regex.test(entity.name));
	}

	updateValue() {
		const {
			value
		} = this.props.input;

		const newValue = value ? this.getValue(value) : '';
		if (newValue !== this.state.value) {
			this.setState({ value: newValue });
		}
	}

	onChange = (event: any, { newValue }: ChangeEvent) => {
		this.setState({value: newValue});
	};

	// запрос на items для рендера
	onSuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	// обработчик выбора адреса
	onSuggestionSelected = (e: any, item: SuggestionSelectedEventData<SuggestionEntity>) => {
		this.setState({
			value: item.suggestion.name,
		});
		this.props.input.onChange(item.suggestion.id);
	};

	renderSuggestionsContainer = ({ containerProps, children }: RenderSuggestionsContainerParams) => {
		const { className, ...otherProps } = containerProps;
		return (
			<Scrollbars
				{ ...otherProps }
				className={ className }
				autoHeightMax={ 400 }
				autoHeight
			>
				{children}
			</Scrollbars>
		);
	};

	renderAutosuggest = (props: any) => {
		const { value, suggestions	} = this.state;
		const { ...otherProps } = props;
		const inputProps = {
			...otherProps,
			value,
			onChange: this.onChange,
			onBlur: () => {
				this.props.input.onBlur(this.props.input.value);
				if (this.props.input.value) {
					this.setState({ value: this.getValue(this.props.input.value) });
				}
			},
		};

		return (
			<Autosuggest
				suggestions={ suggestions }
				onSuggestionSelected={ this.onSuggestionSelected }
				onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
				onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
				renderSuggestion={ renderSuggestion }							// что выводим в выпадашке
				// getSuggestionValue должна вернуть строку https://github.com/moroshko/react-autosuggest#getsuggestionvalue-required
				getSuggestionValue={ getSuggestionValue }							// что отдаем на выход
				renderSuggestionsContainer={ this.renderSuggestionsContainer }
				shouldRenderSuggestions={ alwaysTrue }
				inputProps={ inputProps }
				theme={ theme }
			/>
		);
	};

	render() {
		return (
			<Input
				inputComponent={ this.renderAutosuggest }
				value={ this.props.input.value }
				status={ this.props.meta.touched && this.props.meta.invalid ? 'error' : 'default' }
			/>
		)
	}
}

// eslint-disable-next-line
const AutosuggestInputField = (props: AutosuggestInputProps) => {
	return (
		<FormField
			size="medium"
			component={ AutosuggestInput }
			status={ getValidationStatus(props.meta) }
			{ ...props }
		/>
	)
};

export default AutosuggestInputField;
