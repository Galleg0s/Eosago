var React = require('react');
var TipItem = require('./tip-item.jsx');

module.exports = class extends React.Component {
	render() {
		var _self = this;
		var tips = _self.props.list.map(function(item) {
			return (
				<TipItem item={ item } key={ item.id } />
			);
		});

		if (this.props.isLoading) {
			return <div className="ui-loading-overlay-big ui-loading-hidden-content"></div>;
		} else {
			return (
				<div className="grid-vert-list-large">
					{tips}
				</div>
			);
		}
	}
};
