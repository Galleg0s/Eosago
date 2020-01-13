import React, { Component } from 'react';
import T from 'prop-types';
import { getPluralForm } from 'helpers';
import { Link, Tooltip } from 'react-ui-2018';
import OptionsList from '../OptionsList/OptionsList';

class OptionsTooltip extends Component {
	static propTypes = {
		options: T.arrayOf(T.shape()),
	};

	static defaultProps = {
		options: [],
	};

	get content() {
		return (
			<OptionsList
				options={ this.props.options }
			/>
		);
	}

	render() {
		const { options } = this.props;
		if (!options) {
			return null;
		}
		return (
			<Tooltip
				content={ this.content }
			>
				<Link
					theme="dark"
					type="pseudo"
				>
					{getPluralForm(options.length, ['опция', 'опции', 'опций'])}
				</Link>
			</Tooltip>
		);
	}
}

export default OptionsTooltip;
