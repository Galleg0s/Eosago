import React from 'react';
import ValidationStore from '../../../stores/validation-store.js';
import PanelKasko from './panel-kasko.jsx';

export default class Car extends React.Component {
	render() {
		ValidationStore.setField(['car']);

		return (
			<PanelKasko data={ this.props.data } />
		);
	}
}
