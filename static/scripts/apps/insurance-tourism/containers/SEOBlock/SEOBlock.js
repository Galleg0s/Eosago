import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Accordion } from 'react-ui-2018';

class SEOBlock extends PureComponent {
	static propTypes = {
		data: T.shape(),
	};

	static defaultProps = {
		data: [],
	};

	get content() {
		const { data } = this.props;
		return data.map(({ header, body }) => ({
			header,
			body: <div dangerouslySetInnerHTML={ { __html: body } } />
		}))
	}

	render() {
		const { data } = this.props;
		if (!data || !data.length) {
			return null;
		}

		return (
			<Accordion
				data={ this.content }
				isSeo
			/>
		);
	}
}

export default SEOBlock;
