var React = require('react');
var AppDispatcher = require('../../dispatcher/dispatcher.js');
var UserStore = require('../../stores/user-store.js');
var DataStore = require('../../stores/data-store.js');
var IsMobileDevice = window.banki.env.isMobileDevice;

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this._RememberUserRegionOnClickHandler = this._RememberUserRegionOnClickHandler.bind(this)
		this.state = {
			userRegionId: null
		}
	}
	componentDidMount() {
		var _self = this;
		var userRegionIdCookie = UserStore.getRawCookiesField('user-region-id');

		if (userRegionIdCookie !== undefined && parseInt(userRegionIdCookie) !== 1) {
			DataStore.getUserRegion(parseInt(userRegionIdCookie), function(response) {
				_self._setUserRegion({
					id: parseInt(response.result.data.id),
					name: response.result.data.name
				});
			});
		} else {
			_self._setUserRegion({
				id: 4,
				name: 'Москва'
			});
		}
	}
	componentDidUpdate() {
		// silently confirm region for mobile devices
		if (this.state.userRegionId && IsMobileDevice) {
			this._RememberUserRegionOnClickHandler();
		}
	}
	_update(id, title) {
		AppDispatcher.dispatch({
			action: 'UPDATE',
			field: 'region',
			data: {id: id, title: title}
		});
	}
	_setUserRegion(region) {
		var userRegionData = {
			id: region.id,
			title: region.name
		};

		this.setState({userRegionId: userRegionData});
	}
	_RememberUserRegionOnClickHandler() {
		this._update(this.state.userRegionId.id, this.state.userRegionId.title);
	}
	_USRTriggerOnClickHandler() {
		UserStore.setTempRegionFieldName('region');
	}
	render() {
		return (
			<div className="region-popover">
				<div className="region-popover__container">
					{ this.state.userRegionId ?
						<div>
							<div className="region-popover__title">
								{ 'Ваш город ' + this.state.userRegionId.title + '?' }
							</div>
							<div className="region-popover__buttons">
								<span
									className="button button--bordered button--size_small margin-right-x-small"
									onClick={ this._RememberUserRegionOnClickHandler }
								>Да, запомнить</span>
								<span
									className="button button--bordered button--size_small usr__trigger"
									onClick={ this._USRTriggerOnClickHandler }
								>Другой город</span>
							</div>
						</div> :
						<div className="is-center">
							<span className="ui-loader-icon"></span>
						</div>
					}
				</div>
			</div>
		);
	}
};
