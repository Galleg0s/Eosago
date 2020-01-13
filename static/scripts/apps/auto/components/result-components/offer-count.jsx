var React = require('react');
var ResultStore = require('../../stores/result-store.js');
var Helpers = require('helpers');

class OfferCount extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			count: ResultStore.getResult().count
		}
		this._update = this._update.bind(this)
		this._componentWillMount()
	}
	_componentWillMount() {
		ResultStore.addUpdateListener(this._update);
	}
	componentWillUnmount() {
		ResultStore.removeUpdateListener(this._update);
	}
	_formatCountValues(countObj) {
		var offerCountFormatted = Helpers.getPluralForm(countObj.offers, ['предложение', 'предложения', 'предложений']);
		var companyCountFormatted = Helpers.getPluralForm(countObj.companies, ['страховой компании', 'страховых компаний', 'страховых компаний']);

		return offerCountFormatted + ' от ' + companyCountFormatted;
	}
	_update() {
		var results = ResultStore.getResult();

		this.setState({
			count: results.count
		});
	}
	render() {
		if (this.state.count && this.state.count.offers && this.state.count.companies) {
			return (
				<div className="padding-bottom-medium">
					<div className="header-h3">
						Найдено { this._formatCountValues(this.state.count) }
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

module.exports = OfferCount;
