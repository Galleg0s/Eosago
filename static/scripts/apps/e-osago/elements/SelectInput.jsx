import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'ui.select';

class SelectInput extends Component {
	componentDidMount() {
		const { items, name, value, onChange } = this.props;

		this.selectInstance = new Select({
			$toggler: $(this.selectInput),
			togglerText: 'Выберите',
			onItemSelect: function(selected) {
				onChange({
					target: {
						type: 'select',
						name,
						value: selected[0].id
					}
				});
			},
			items: items.map((item) => (
				{ id: item.value, name: item.title, selected: item.value == value }
			))
		});
	}

	componentWillUpdate(nextProps) {
		const selectedItem = this.selectInstance.getSelectedItems()[0];

		if (!selectedItem || selectedItem.id != nextProps.value) {
			this.selectInstance.selectItem(nextProps.value);
		}
	}

	componentWillUnmount() {
		this.selectInstance.destroy();
	}

	render() {
		const { ...rest } = this.props;

		return (
			<div ref={ (input) => { this.selectInput = input; } } { ...rest }></div>
		);
	}
}

export default SelectInput;
