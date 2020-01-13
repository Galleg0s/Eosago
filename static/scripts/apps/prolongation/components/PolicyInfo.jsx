import React, { Fragment } from 'react';
import { FadedDropdownPanel, Icon } from 'react-ui-2018';
import { addLeadingZero, getPluralForm } from 'helpers';

export default function PolicyInfo(props) {
	const { car, drivers, osagoPolicyStartDate } = props;
	const startDate = `${addLeadingZero(osagoPolicyStartDate.getDate())}.${addLeadingZero(osagoPolicyStartDate.getMonth() + 1)}.${osagoPolicyStartDate.getFullYear() + 1}`;

	return !banki.env.isMobileDevice ? (
		<Fragment>
			<h3 className="text-size-3 color-white">Продлите полис в 1 клик:</h3>
			<ul className="table-list table-list--dotted table-list--size_default table-list--dark color-white margin-top-medium">
				<li className="table-list__item">
					<span className="table-list__key">Начало действия полиса</span>
					<span className="table-list__dots" />
					<span className="table-list__value">с { startDate }</span>
				</li>
				<li className="table-list__item">
					<span className="table-list__key">Срок</span>
					<span className="table-list__dots" />
					<span className="table-list__value">1 год</span>
				</li>
				<li className="table-list__item">
					<span className="table-list__key">Автомобиль</span>
					<span className="table-list__dots" />
					<span className="table-list__value">{ car.model.value } { car.year }</span>
				</li>
				<li className="table-list__item">
					<span className="table-list__key">Регистрационный номер</span>
					<span className="table-list__dots" />
					<span className="table-list__value">{ car.license_plate }</span>
				</li>
				<li className="table-list__item">
					<span className="table-list__key">VIN номер</span>
					<span className="table-list__dots" />
					<span className="table-list__value">{ car.vin }</span>
				</li>
				{ drivers === 'multidrive' ? (
					<li className="table-list__item">
						<span className="table-list__key">Водители</span>
						<span className="table-list__dots" />
						<span className="table-list__value">без ограничений</span>
					</li>
				) : drivers.map((driver, i) =>
					<li className="table-list__item" key={ driver.birthday }>
						<span className="table-list__key">Водитель { i + 1 }</span>
						<span className="table-list__dots" />
						<span className="table-list__value">{ `${drivers[i].first_name} ${drivers[i].patronymic} ${drivers[i].last_name}, ${driver.license.series}-${driver.license.number}` }</span>
					</li>
				) }
			</ul>
		</Fragment>
	) : (
		<Fragment>
			<h3 className="text-size-3 color-white text-weight-bolder margin-bottom-medium">Продлите полис в 1 клик:</h3>
			<FadedDropdownPanel
				maxHeight={ 0 }
				bgColor="transparent"
				togglerPosition="left"
				toggleOpened={
					<Fragment>
						<div className="flexbox flexbox--row flexbox--justify-content_flex-start flexbox--align-items_center flexbox--gap_xs text-size-4 text-weight-normal margin-bottom-medium margin-top-xx-small">
							<span>Скрыть</span>
							<Icon type="arrow-top" />
						</div>
						<div className="text-size-3 text-weight-normal">
							<div>
								<div className="margin-bottom-medium">Действует с { startDate }</div>
								<div className="margin-bottom-default">Срок 1 год</div>
							</div>
							<div className="padding-top-default border-gray--alpha-20">
								<div className="margin-bottom-medium">Ford Focus vv 2012</div>
								<div className="margin-bottom-medium">{ car.license_plate }</div>
								<div className="margin-bottom-default">{ car.vin }</div>
							</div>
							<div className="padding-top-default border-gray--alpha-20">
								{ drivers === 'multidrive' ? (
									<div className="margin-bottom-medium">
										Водители без ограничений
									</div>
								) : drivers.map((driver, i) =>
									<div className="margin-bottom-medium" key={ driver.birthday }>
										{ `${drivers[i].first_name} ${drivers[i].patronymic} ${drivers[i].last_name}, ${driver.license.series}-${driver.license.number}` }
									</div>
								) }
							</div>
						</div>
					</Fragment>
				}
				toggleClosed={
					<Fragment>
						<div className="text-size-3 text-weight-normal margin-bottom-default">
							Действует с { startDate } на 1 год, { car.model.value } { car.year }{ drivers !== 'multidrive' && `, ${getPluralForm(drivers.length, ['водитель', 'водителя', 'водителей'])}...`}
						</div>
						<div className="flexbox flexbox--row flexbox--justify-content_flex-start flexbox--align-items_center flexbox--gap_xs text-size-4 text-weight-normal">
							<span>Подробнее</span>
							<Icon type="arrow-down" />
						</div>
					</Fragment>
				}
			/>
		</Fragment>
	)
}
