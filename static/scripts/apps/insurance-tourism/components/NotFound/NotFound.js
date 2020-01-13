import React, { Component } from 'react';
import { Panel, Icon, Button, Link } from 'react-ui-2018';
import image from './noresults.png';

class NotFound extends Component {
	get content() {
		return (
			<div className="text-align-center">
				<img
					src={ image }
					style={ {maxWidth: '100%'} }
					alt="Ничего не найдено"
				/>
				<h3 className="text-size-3 text-weight-bold margin-top-medium">
					По вашему запросу ничего не найдено
				</h3>
				<p className="text-size-4 margin-top-small">
					Попробуйте изменить параметры фильтра, вам обязательно повезет.
				</p>
			</div>
		);
	}

	render() {
		return (
			<Panel
				sections={ [this.content] }
			/>
		);
	}
}

export default NotFound;
