var React = require('react');
var classNames = require('classnames');
var AnimateHeight = require('react-animate-height');
import { Icon } from 'react-ui';

module.exports = class extends React.Component {
	render() {
		var isActiveOptions = this.props.isActiveOptions ? this.props.isActiveOptions() : false;

		return (
			<AnimateHeight
				className={ 'product-options-dropdown' }
				duration={ 600 }
				height={ isActiveOptions ? 'auto' : '0' }
			>
				<div className={ classNames('product-options',
					'margin-left-default',
					'margin-right-default',
					'padding-right-x-large',
					'padding-top-default',
					'padding-bottom-default',
					'position-relative',
					{ 'product-options--active': isActiveOptions }) }
				>
					<div className="product-options__arrow"></div>
					<span className="product-options__close" onClick={ this.props.toggleOptions }>
						<Icon name="close" size="small" />
					</span>
					<div className="grid__row grid__row--v-xs">
						{ this.props.options.map((option, index) =>
							<div key={ index } className="grid__cell grid__cell--12 grid__cell--sm-min font-size-medium">
								<Icon name="checkmark" size="small" color="orange" className="margin-right-x-small" />
								{ option.title }
							</div>
						)}
					</div>
				</div>
			</AnimateHeight>

		)
	}
};
