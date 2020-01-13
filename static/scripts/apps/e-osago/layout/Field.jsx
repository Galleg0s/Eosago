import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'ui.tooltip';

class Field extends Component {
	componentDidMount() {
		if (this.tooltip !== undefined) {
			new Tooltip($(this.tooltip), {
				style: 'light',
				placement: 'top',
				content: this.tooltip.getAttribute('data-content')
			});
		}
	}

	render() {
		const { name, children, noMargin, hint, tooltip } = this.props;
		const nameCls = classNames('font-size-medium font-bold', {
			'margin-top-x-small': !hint && !noMargin
		});

		return (
			<div className="grid__row grid__row--h-xs">
				<div className="grid__cell grid__cell--12 grid__cell--sm-6">
					<div className={ nameCls }>
						{ name }
						{ tooltip &&
							<i
								className="icon-font icon-question margin-left-xx-small saturate-on-hover"
								data-content={ tooltip }
								ref={ (tooltip) => { this.tooltip = tooltip; } }
							></i>
						}
					</div>
					{ hint &&
						<div className="color-gray-gray margin-top-xx-small" style={ {marginBottom: '-5px'} }>{ hint }</div>
					}
				</div>
				<div className="grid__cell grid__cell--12 grid__cell--sm-6">
					{ children }
				</div>
			</div>
		);
	}
}

export default Field;
