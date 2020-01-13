import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import router from 'router';

const NASKO_STATUS_ROUTE = router.generate('bankiru_insurance_eosago_nasko_order_status');
const MESSAGES_TITLE = [
	'Спасибо за покупку!',
	'Полис не оплачен',
	'Полис не найден',
];
const MESSAGES_TEXT = [
	'Электронный полис оплачен и в течение 30 минут будет отправлен на вашу электронную почту. Если полис не пришел (и его нет в папке Спам), а также по любым другим проблемам, пишите на insurance@banki.ru',
	'К сожалению, не удалось получить подтверждение об оплате полиса. Попробуйте повторить попытку позднее. Если это сообщение возникло по ошибке, напишите нам на insurance@banki.ru',
	'К сожалению, не удалось найти полис по данному номеру',
];

class NaskoStatusComponent extends Component {
	static props = {
		orderId: PropTypes.number.isRequired,
	};

	state = {
		policyNumber: undefined,
		policyPrice: undefined,
		status: undefined,
		title: 'Получаем статус оплаты',
		text: '',
	};

	componentWillMount() {
		if (!this.props.orderId) {
			return;
		}

		const NASKO_STATUS_URL = `${NASKO_STATUS_ROUTE}/${this.props.orderId}`;
		const options = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			}
		};

		fetch(NASKO_STATUS_URL, options)
			.then(res => res.json())
			.then(data => {
				if (data.status === 1) { // статусы 0-3 описаны в INS-3879
					this.setState({
						title: MESSAGES_TITLE[0],
						text: MESSAGES_TEXT[0],
						status: data.status,
						policyNumber: data.policy_number,
						policyPrice: data.insurance_premium,
					});
				} else {
					this.setState({
						title: MESSAGES_TITLE[1],
						text: MESSAGES_TEXT[1],
						status: data.status,
					});
				}
			})
			.catch(error => {
				this.setState({
					title: MESSAGES_TITLE[2],
					text: MESSAGES_TEXT[2],
					status: 4,
				});
			});
	}

	render() {
		const { policyNumber, policyPrice, status, text, title } = this.state;

		return (
			<Fragment>
				<h1 className="header-h0">{ title }</h1>
				<h3 className="header-h3 margin-top-default">{ text }</h3>
				{ status === 1 && (
					<table className="standard-table standard-table--list standard-table--no-border-bottom margin-top-default">
						<tbody>
							<tr>
								<th><span className="font-size-large">Страховая компания</span></th>
								<td><span className="font-size-large">Наско</span></td>
							</tr>
							<tr>
								<th><span className="font-size-large">Номер полиса</span></th>
								<td><span className="font-size-large">{ policyNumber }</span></td>
							</tr>
							<tr className="basic-table__row">
								<th><span className="font-size-large">Стоимость</span></th>
								<td><span className="font-size-large font-bold">{ policyPrice } ₽</span></td>
							</tr>
						</tbody>
					</table>
				) }
				{ status === undefined && (
					<div className="ui-loading-overlay-big ui-loading-hidden-content"></div>
				) }
			</Fragment>
		)
	}
}

export default params => {
	const containerEl = document.createElement('div');
	const NaskoStatusInfo = document.querySelector('#nasko-status-info');
	NaskoStatusInfo.appendChild(containerEl);
	ReactDOM.render(<NaskoStatusComponent orderId={ params.orderId } />, containerEl);
}
