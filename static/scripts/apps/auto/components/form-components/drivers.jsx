var React = require('react');
var Franchise = require('./fields/franchise.jsx');
var RepairType = require('./fields/repair-type.jsx');
var Region = require('./fields/region.jsx');
var RegionRegistration = require('./fields/region-registration.jsx');
var Multidrive = require('./driver/multidrive.jsx');
var Discount = require('./driver/discount.jsx');

module.exports = class extends React.Component {
	render() {
		return (
			<div>
				<Franchise data={ this.props.data } />
				<RepairType data={ this.props.data } />
				<Region data={ this.props.data } />
				<RegionRegistration data={ this.props.data } />
				<Multidrive data={ this.props.data } />
				<Discount data={ this.props.data } />
			</div>
		);
	}
};
