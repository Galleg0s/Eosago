var React = require('react');

module.exports = class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	render() {
		return (
			<div className="region-popover">
				<div className="region-popover__container">
					<div>
						<div className="region-popover__title">Загрузить ваш последний расчет?</div>
						<div className="region-popover__buttons">
							<span
								className="button button--bordered button--size_small margin-right-x-small"
								onClick={ this.props.onConfirm }
							>Да, загрузить</span>
							<span
								className="button button--bordered button--size_small"
								onClick={ this.props.onCancel }
							>Другой расчет</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
