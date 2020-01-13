var React = require('react');
var Tooltip = require('ui.tooltip');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tooltipInstance: null
		}
	}

	componentDidMount() {
		var newTooltipInstance = this._initTooltip(this.props.item);

		this.setState({
			tooltipInstance: newTooltipInstance
		});
	}
	componentWillUnmount() {
		this._destroyTooltip(this.state.tooltipInstance);
	}
	_getTooltipContent(item) {
		var tooltipContent = '';
		var image = '<img class="display-block margin-bottom-small" src="' + item.content_pic_url + '" width="100%" alt="' + item.title + '" />';
		var title = '<div class="font-size-medium font-bold margin-bottom-x-small">' + item.title + '</div>';
		var description = '<div class="font-size-medium">' + item.description + '</div>';

		tooltipContent += '<div>';
		tooltipContent += image;
		tooltipContent += title;
		tooltipContent += description;
		tooltipContent += '</div>';

		return tooltipContent;
	}
	_initTooltip(item) {
		var _self = this;
		var tipItem = this.refs.tipItem;

		return new Tooltip(tipItem, {
			placement: 'left',
			trigger: 'click',
			width: '360px',
			content: _self._getTooltipContent(item),
			close: false,
			onShow: function() {
				tipItem.classList.add('active');
			},
			onHide: function() {
				tipItem.classList.remove('active');
			}
		});
	}
	_destroyTooltip(instance) {
		if (instance) {
			instance.destroy();
		}
	}
	render() {
		return (
			<div>
				<div className="tip-item is-center cursor-pointer" ref="tipItem">
					<img
						className="tip-item__image" src={ this.props.item.tab_pic_url }
						width="100" height="100" alt={ this.props.item.title }
					/>
					<div className="tip-item__title font-size-medium margin-top-small">{ this.props.item.title }</div>
				</div>
			</div>
		);
	}
};
