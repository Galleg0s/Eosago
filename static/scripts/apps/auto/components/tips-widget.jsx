var React = require('react');
var API = require('../utils/api.js');
var UserStore = require('../stores/user-store.js');
var DataStore = require('../stores/data-store.js');
var TipList = require('./tips/tip-list.jsx');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			regionId: null,
			insuranceTypeId: null,
			tipList: [],
			isLoading: false
		}
		this._update = this._update.bind(this)
		this._componentWillMount()
	}
	_componentWillMount() {
		UserStore.addChangeListener(this._update);
	}
	componentDidMount() {
		this._update();
	}
	componentWillUnmount() {
		UserStore.removeChangeListener(this._update);
	}
	_update() {
		var formData = UserStore.getData();
		var regionId = formData.region.id;
		var insuranceTypeId = null;

		if (formData.type.kasko === formData.type.osago) {
			insuranceTypeId = null;
		} else {
			if (formData.type.kasko) {
				insuranceTypeId = 1;
			}

			if (formData.type.osago) {
				insuranceTypeId = 2;
			}
		}

		if (regionId !== null && (regionId !== this.state.regionId || insuranceTypeId !== this.state.insuranceTypeId)) {
			this._getTips(regionId, insuranceTypeId);
		}

		this.setState({
			regionId: regionId,
			insuranceTypeId: insuranceTypeId
		});
	}
	_getTips(regionId, insuranceTypeId) {
		var _self = this;

		_self.setState({
			isLoading: true
		});

		API.getTips(regionId, insuranceTypeId, function(result) {
			var list;

			if (result.tips && result.tips.length) {
				list = result.tips;
			} else {
				list = [];
			}

			_self.setState({
				tipList: list,
				isLoading: false
			});

			DataStore.setTips(list);
		}, function() {
			_self.setState({
				tipList: [],
				isLoading: false
			});

			DataStore.setTips([]);
		});
	}
	render() {
		if (this.state.regionId) {
			return (
				<div className="ui-panel-white-bordered is-center">
					<div className="header-h3 margin-bottom-medium">Заказывайте полис у нас &mdash; это выгодно</div>
					<TipList
						list={ this.state.tipList }
						insuranceTypeId={ this.state.insuranceTypeId }
						isLoading={ this.state.isLoading }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
};
