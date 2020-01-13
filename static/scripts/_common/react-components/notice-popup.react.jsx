var React = require('react');
import { AlertPanel } from 'react-ui';

module.exports = class extends React.Component {
	render() {
		return (
			<div className="margin-top-default margin-bottom-default">
				<AlertPanel
					theme="warning"
				>
					<span>{ this.props.content }</span>
				</AlertPanel>
			</div>
		)
	}
};
