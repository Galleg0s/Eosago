import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import {
	Panel,
	Link,
} from 'react-ui-2018';
import MobileOptionsModal from '../../components/MobileOptionsModal/MobileOptionsModal';
import s from './MobileOptions.module.styl';

class MobileOptions extends Component {
	static propTypes = {
		searchParameters: T.shape,
	};

	state = {
		isModalOpen: false,
	};

	get optionsBtn() {
		const { searchParameters: { options } } = this.props;
		return (
			<div className="text-align-center padding-top-small-fixed padding-bottom-small-fixed">
				<Link
					leftIcon="options"
					onClick={ this.openModal }
				>
					Улучшить полис { options && options.length !== 0 && <span className={ `bg-major-green ${s.dot}` } ></span> }
				</Link>
			</div>
		);
	}

	openModal = () => { this.setState({isModalOpen: true}) };
	closeModal = () => { this.setState({isModalOpen: false}) };

	get mobileOptionsModal() {
		return (
			<MobileOptionsModal
				isOpen={ this.state.isModalOpen }
				onRequestClose={ this.closeModal }
			/>
		)
	}

	render() {
		return (
			<Fragment>
				<Panel
					sections={ [
						this.optionsBtn
					] }
				/>
				{ this.mobileOptionsModal }
			</Fragment>
		)
	}
}

export default MobileOptions;
