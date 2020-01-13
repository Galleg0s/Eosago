import React from 'react';
import AppDispatcher from '../../../dispatcher/dispatcher.js';
import BrandProp from './car-brand.jsx';
import OtherProp from './car-property.jsx';
import { Icon } from 'react-ui';

export default class PanelKasko extends React.Component {
	constructor(props) {
		super(props);
		this.state = this._prepareData(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this._prepareData(nextProps));
	}

	_prepareData(props) {
		var current = 0;
		var carProps = props.data.car;

		var selected = [];

		for (var i = 0; i < carProps.length; i++) {
			if (props.data.is_custom_car || carProps[i].id !== null) {
				current = carProps.length === i ? null : i + 1;
				selected.push(carProps[i]);
			} else {
				break;
			}
		}

		var currentProp = current === null ? null : props.data.car[current];

		return {
			selected: selected,
			current: currentProp
		};
	}

	_clearProperty(property) {
		return () => {
			AppDispatcher.dispatch({
				action: 'CLEAR_CAR_PROPERTY',
				code: property.code
			});
		};
	}

	render() {

		if (this.state.selected.length) {
			var selectedProps = (<div>
				<div className="inline-elements">
					{this.state.selected.filter(carProp => carProp.code !== 'power').map(carProp => {
						return (
							<div key={ `carProp-${carProp.code}` }>
								<span>{carProp.value}</span>
								<Icon
									name="close"
									color="red"
									size="small"
									clickHandler={ this._clearProperty(carProp) }
									className="margin-left-x-small icon-hover"
								/>
							</div>
						)
					})}
				</div>
			</div>);
		}

		if (this.state.current) {
			var Prop = this.state.current.code === 'brand' ? BrandProp : OtherProp;
			var currentProp = (
				<div>
					<div className="font-size-large">
						{ this.state.current.title }
					</div>

					<hr className="hor-content-separator hor-content-separator--dark" />

					<Prop code={ this.state.current.code } />
				</div>
			)
		}

		return (
			<div className="bg-white padding-default ui-shadow-level-1">
				<div className="grid-vert-list-default">
					{ selectedProps }
					{ currentProp }
				</div>
			</div>
		)
	}
}
