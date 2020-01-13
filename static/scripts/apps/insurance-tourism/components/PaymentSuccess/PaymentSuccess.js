import React, { Component } from 'react';
import T from 'prop-types';
import cx from 'classnames';
import { applyContainerQuery } from 'react-container-query';
import { Panel, Icon, Button, Link } from 'react-ui-2018';

const query = {
	md: {
		minWidth: 632
	},
	/** макет 320 */
	xs: {
		maxWidth: 631
	}
};

class PaymentSuccess extends Component {
	static propTypes = {
		isProcessing: T.bool,
		policies: T.arrayOf(T.shape()),
		containerQuery: T.shape(),
	};

	static defaultProps = {
		isProcessing: true,
		policies: [],
		containerQuery: {},
	};

	get secondaryMessage() {
		const { isProcessing, policies } = this.props;
		const { xs, md } = this.props.containerQuery;
		const textSizeMessage = cx(xs ? 'text-size-6' : 'text-size-4');
		if (isProcessing) {
			return (
				<p className={ textSizeMessage }>
					Ваш полис формируется. Подождите, это может занять некоторое время
				</p>
			);
		}
		if (policies && policies.length) {
			return (
				<p className={ textSizeMessage }>
					Полис доступен для скачивания, а также отправлен вам на e-mail.
					<br />
					Желаем вам приятной поездки.
				</p>
			);
		}
		return (
			<p className={ textSizeMessage }>
				В ближайшее время полис будет отправлен вам на e-mail.
				<br />
				Желаем вам приятной поездки.
			</p>
		);
	}

	get policies() {
		const { isProcessing, policies } = this.props;
		const { xs, md } = this.props.containerQuery;
		if (isProcessing) {
			return (
				<div className="ui-loader-icon ui-loader-icon-big" />
			);
		}
		return (
			<div className="flexbox flexbox--row flexbox--justify-content_center flexbox--gap_small">
				{policies.map(policy => (
					<div key={ policy.id } className="flexbox__item">
						<Button
							href={ policy.webPath }
							target="_blank"
							fullWidth={ xs }
							size={ xs ? 'large' : 'medium' }
						>
							Скачать полис
						</Button>
					</div>
				))}
			</div>
		);
	}

	get content() {
		const { isProcessing } = this.props;
		const { xs, md } = this.props.containerQuery;

		if (xs) {
			return (
				<div className="text-align-center">
					<div>
						<Icon
							type="success"
							size="xlarge"
							color="major-green"
						/>
					</div>
					<h3 className="text-size-5 text-weight-bold margin-top-small margin-bottom-small">
						{ isProcessing ? 'Оплата успешно произведена!' : 'Спасибо за покупку!' }
					</h3>
					{ this.secondaryMessage }
					<div className="margin-top-default margin-bottom-default">
						{ this.policies }
					</div>
					<p className="text-size-6 color-minor-black-lighten margin-top-default">
						Если у вас возникнут вопросы, мы будем рады помочь <Link href="mailto:insurance@banki.ru"> на
						insurance@banki.ru.</Link>
					</p>
				</div>
			);
		} else {
			return (
				<div className="text-align-center">
					<div>
						<Icon
							type="success"
							size="xlarge"
							color="major-green"
						/>
					</div>
					<h3 className="text-size-3 margin-top-small margin-bottom-small">
						{isProcessing ? 'Оплата успешно произведена!' : 'Спасибо за покупку!'}
					</h3>
					{ this.secondaryMessage }
					<div className="margin-top-default margin-bottom-default">
						{ this.policies }
					</div>
					<p className="text-size-5 color-minor-black-lighten margin-top-default">
						Если у вас возникнут вопросы, мы будем рады помочь <Link href="mailto:insurance@banki.ru"> на
						insurance@banki.ru.</Link>
					</p>
				</div>
			);
		}
	}

	render() {
		return (
			<Panel
				sections={ [this.content] }
			/>
		);
	}
}

export default applyContainerQuery(PaymentSuccess, query);
