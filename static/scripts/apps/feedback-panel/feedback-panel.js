import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Icon, Link } from 'react-ui-2018';
import './feedback-panel.styl';

const BASE_LINK = '/info/contacts/feedback/';
const emptyFunc = () => {};

/**
 * Компонент панели обратной связи для нового гайда
 * аналог htdocs/static/common/ui-elements/feedback-panel/feedback-panel.js
 * Макеты:
 * https://projects.invisionapp.com/d/main#/console/13799672/332332159/preview
 * https://projects.invisionapp.com/d/main#/console/13799672/332332160/inspect
 * ---------------------------------------------------------------------------
 * Пример использования в шаблоне:
 * require(["{{ static_asset('/static/bundles/ui-2013/InsuranceBundle/scripts/apps/feedback-panel.js') }}"], function (feedbackPanel) {
 *		feedbackPanel.default({
 *			title: 'Задать вопрос по работе сервиса',
 *			feedbackParams: {
 *				type: 'OTHER',
 *				theme: 'Задать вопрос по работе сервиса СВЗР'
 *			}
 *		});
 *	});
 * */
class FeedbackPanelComponent extends Component {
	static propTypes = {
		/** Текст отображаемый в раскрытом состоянии */
		title: PropTypes.string.isRequired,
		/** Название иконки ('icon-{name}') */
		icon: PropTypes.string,
		/** Объект с GET-параметрами для страницы обратной связи */
		feedbackParams: PropTypes.shape({
			/** Тип обращения (проблема, предложение, другое) */
			type: PropTypes.oneOf(['ERROR', 'IDEA', 'OTHER']),
			/** Тема обращения */
			theme: PropTypes.string
		})
	};

	static defaultProps = {
		icon: 'faq-help'
	};

	state = {
		collapsed: false
	};

	collapsePanel = () => {
		this.setState({
			collapsed: true
		})
	};

	showPanel = () => {
		this.setState({
			collapsed: false
		})
	};

	goToFeedbackPage = () => {
		const { feedbackParams: { type, theme } } = this.props;
		window.open(`${ BASE_LINK }?type_question=${ type ? type : '' }&theme_subject=${ theme ? theme : '' }`);
	};

	render() {
		const { icon, title } = this.props;

		return (
			<div className="feedback-panel">
				<div className="flexbox flexbox__row">
					{ !this.state.collapsed ? (
						<Fragment>
							<div
								className="feedback-panel__content"
								onClick={ this.goToFeedbackPage }
							>
								<Link
									leftIcon={ icon }
									theme="dark"
									onClick={ emptyFunc }
								>
									{ title }
								</Link>
							</div>
							<div
								className="feedback-panel__close"
								onClick={ this.collapsePanel }
							>
								<Icon
									type="close"
									size="medium"
									color="white"
									saturate
								/>
							</div>
						</Fragment>
					) : (
						<div
							className="feedback-panel__show"
							onClick={ this.showPanel }
						>
							<Link
								theme="dark"
								onClick={ emptyFunc }
							>
								<Icon
									type={ icon }
									size="medium"
								/>
							</Link>
						</div>
					)}
				</div>
			</div>
		)
	}
}

export default params => {
	const containerEl = document.createElement('div');
	document.body.appendChild(containerEl);
	ReactDOM.render(<FeedbackPanelComponent title={ params.title } feedbackParams={ params.feedbackParams } />, containerEl);
}
