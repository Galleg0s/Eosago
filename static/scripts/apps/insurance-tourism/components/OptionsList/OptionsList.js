import { TextList } from 'react-ui-2018';
import T from 'prop-types';

export default function OptionsList({ options }) {
	return (
		<TextList
			data={ {
				list: options.map(option => {
					return {
						text: option.name,
					};
				}),
			} }
			bulletsType="check"
		/>
	);
}

OptionsList.propTypes = {
	options: T.arrayOf(T.shape()),
};

OptionsList.defaultProps = {
	options: [],
};
