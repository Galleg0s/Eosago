var React = require('react');
import { Icon } from 'react-ui';

module.exports = class extends React.Component {
	render() {
		return this.props.isInCompare ? (
			<span className="link-with-icon text-nowrap" title="Удалить из сравнения" onClick={ this.props.removeHandler }>
				<Icon name="checkmark-circled" color="green" size="small" className="link-with-icon__icon" />
				<span className="link-with-icon__text">В сравнении</span>
			</span>
		) : (
			<span className="link-with-icon text-nowrap" title="Добавить к сравнению" onClick={ this.props.addHandler }>
				<Icon name="list" color="gray" size="small" className="link-with-icon__icon" />
				<span className="link-with-icon__text">Сравнить</span>
			</span>
		);
	}
};
