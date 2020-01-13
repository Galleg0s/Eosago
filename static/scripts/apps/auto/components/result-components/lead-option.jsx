var React = require('react');
var ReactDOM = require('react-dom');
var Tooltip = require('ui.tooltip');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			instance: null
		}
	}
	componentDidMount() {
		this.setState({
			instance: new Tooltip(this.refs.element, {
				placement: 'bottom',
				content: this.props.content,
				trigger: 'hover focus'
			})
		});
	}
	componentDidUpdate(prevProps) {
		if (prevProps.content !== this.props.content) {
			this.state.instance.setContent(this.props.content);
		}
	}
	componentWillUnmount() {
		if (this.state.instance) {
			this.state.instance.destroy();
		}
	}
	render() {
		return (
			<div className="grid__cell grid__cell--min position-relative">
				<img
					ref="element"
					width="24"
					height="24"
					tabIndex="-1"
					src={ this.props.image }
				/>
			</div>
		);
	}
};
