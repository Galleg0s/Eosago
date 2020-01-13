var React = require('react');

module.exports = class extends React.Component {
	render() {
		'use strict';

		var sign = this.props.discount_in_percent ? '' : '₽';
		var price = this.props.price ?
			this.props.price + ' ' + sign
			: (<span className="font-size-medium font-normal">&mdash;</span>);
		var price_without_discount = this.props.price && this.props.discount_in_percent ?
			(<s className="color-border-dark">{ this.props.price_without_discount }</s>) : null;

		return (
			<div className="grid__cell grid__cell--12">
				<div className="header-h3 product__value">
					{ price }
					{ price_without_discount }
				</div>
			</div>
		);
	}
};
