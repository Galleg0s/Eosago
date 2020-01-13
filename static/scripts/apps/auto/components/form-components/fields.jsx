var React = require('react');
var Price = require('./fields/price.jsx');
var CreditCar = require('./fields/credit-car.jsx');
var CreditBank = require('./fields/credit-bank.jsx');
var Warranty = require('./fields/warranty.jsx');
var HasAntiTheftSystem = require('./fields/has-anti-theft-system.jsx');
var AntiTheftSystem = require('./fields/anti-theft-system.jsx');
var ParkingType = require('./fields/parking-type.jsx');
var FirstOsago = require('./fields/first-osago.jsx');
var DiagnosticCard = require('./fields/diagnostic-card.jsx');
var Period = require('./fields/period.jsx');
var PolicyStartDate = require('./fields/policy-start-date.jsx');
var CarUsedSince = require('./fields/car-used-since.jsx');

class Fields extends React.Component {
	render() {
		return (
			<div className="grid-vert-list-default">
				<PolicyStartDate data={ this.props.data } />
				<Period data={ this.props.data } />
				{ this.props.data.type.kasko && <CarUsedSince data={ this.props.data } /> }
				<Price data={ this.props.data } />
				<CreditCar data={ this.props.data } />
				<CreditBank data={ this.props.data } />
				<Warranty data={ this.props.data } />
				<HasAntiTheftSystem data={ this.props.data } />
				<AntiTheftSystem data={ this.props.data } />
				<ParkingType data={ this.props.data } />
				<FirstOsago data={ this.props.data } />
				<DiagnosticCard data={ this.props.data } />
			</div>
		)
	}
}

module.exports = Fields;
