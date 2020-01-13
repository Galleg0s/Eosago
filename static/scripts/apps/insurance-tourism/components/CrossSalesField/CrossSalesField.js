import React, { Component } from 'react';
import T from 'prop-types';
import { SelectionList } from 'react-ui-2018';

class CrossSalesField extends Component {
	static propTypes = {
		input: T.shape({}).isRequired,
		crossSales: T.arrayOf(T.shape({
			diffSum: T.number,
			option: T.shape({
				id: T.number,
			}),
		})),
		onAddCrossale: T.func,
		onRemoveCrossale: T.func,
		isMobile: T.bool,
	};

	static defaultProps = {
		options: [],
		isMobile: false,
	};

	get items() {
		const { crossSales } = this.props;
		return crossSales.map(({ option, diffSum }) => {
			if (!option) {
				return null;
			}
			return (
				<SelectionList.Item
					key={ option.id }
					value={ option.id }
					title={ option.name }
					description={ option.comment }
					after={ `+ ${Math.ceil(diffSum)} ₽` }
				/>
			);
		});
	}

	onChange = (values, itemId) => {
		const {
			input,
			onAddCrossale,
			onRemoveCrossale,
		} = this.props;
		values.includes(itemId)
			? onAddCrossale(itemId)
			: onRemoveCrossale(itemId);
		input.onChange(values);
	};

	render() {
		const { input, crossSales, isMobile } = this.props;

		if (!crossSales) {
			return null;
		}

		return (
			<SelectionList
				value={ input.value }
				onChange={ this.onChange }
				isMobile={ isMobile }
			>
				{ this.items }
			</SelectionList>
		);
	}
}

export default CrossSalesField;
