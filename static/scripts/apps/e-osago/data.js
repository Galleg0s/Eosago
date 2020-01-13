const Steps = [
	{title: 'Страхователь', formKey: 'insurant'},
	{title: 'Собственник', formKey: 'owner'},
	{title: 'Водители', formKey: 'drivers'},
	{title: 'Автомобиль', formKey: 'car'},
];

const now = new Date();
let _100YearsAgo = new Date();
_100YearsAgo = _100YearsAgo.setFullYear(now.getFullYear() - 100).valueOf();
let _18YearsAgo = new Date();
_18YearsAgo = _18YearsAgo.setFullYear(now.getFullYear() - 18).valueOf();
let _90YearsAgo = new Date();
_90YearsAgo = _90YearsAgo.setFullYear(now.getFullYear() - 90).valueOf();

const multidriveItems = [
	{title: 'ограниченный список', value: false},
	{title: 'без ограничений', value: true}
];

const usagePeriodsList = [
	{value: 1, title: '3 месяца'},
	{value: 2, title: '4 месяца'},
	{value: 3, title: '5 месяцев'},
	{value: 4, title: '6 месяцев'},
	{value: 5, title: '7 месяцев'},
	{value: 6, title: '8 месяцев'},
	{value: 7, title: '9 месяцев'},
	{value: 8, title: '12 месяцев'}
];

const constraints = {
	car: {
		power: {
			presence: true,
			numericality: {
				onlyInteger: false,
				strict: true,
				greaterThanOrEqualTo: 1,
				lessThanOrEqualTo: 2000,
				message: '^Введите корректную мощность'
			}
		},
		diagnostic_card: {
			presence: false,
			format: {
				pattern: /^[0-9]{21}|[0-9]{15}$|^$/,
				message: '^Укажите номер диагностической карты (15 или 21 цифра подряд)'
			}
		},
		diagnostic_card_date_end: {
			presence: false,
			numericality: {
				onlyInteger: true,
				strict: true,
				greaterThanOrEqualTo: (new Date(now.getFullYear(), now.getMonth(), now.getDate())).valueOf(),
				message: '^Введите корректную дату'
			}
		},
		registration_passport: {
			presence: true,
			format: {
				pattern: /^[0-9]{2} [а-яА-ЯёЁ0-9]{2} [0-9]{6}$/,
				message: '^Введите корректный номер свидетельства'
			}
		},
		registration_passport_date: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				greaterThanOrEqualTo: _100YearsAgo,
				lessThanOrEqualTo: now.valueOf(),
				message: (value, attribute, validatorOptions, attributes, globalOptions) => {
					if (value < validatorOptions.greaterThanOrEqualTo) {
						return '^Дата не может быть меньше года выпуска автомобиля';
					} else {
						return '^Введите корректную дату'
					}
				}
			}
		},
		license_plate: {
			format: {
				pattern: /^[АВЕКМНОРСТУХ]{1}[0-9]{3}[АВЕКМНОРСТУХ]{2} [0-9]{2,3}$|^$/,
				message: '^Введите корректный гос. номер'
			}
		},
		vin: {
			format: {
				pattern: /^[A-HJ-NPR-Z0-9]{17}$/,
				message: '^Введите корректный VIN номер (17 знаков)'
			}
		},
		body_number: {
			format: {
				pattern: /^[A-HJ-NPR-Z0-9\u0020\u002D]{8,21}$/,
				message: '^Введите корректный номер кузова'
			}
		},
		has_trailer: {
			presence: true,
		},
		used_as_taxi: {
			presence: true,
			checkbox: {
				checked: false,
				message: `^К сожалению, сервис производит расчеты только для легковых автомобилей, используемых в личных
				целях. Для расчета стоимости и оформления полиса для других типов ТС и целей использования посетите сайты страховых компаний.`
			}
		}
	},
	owner: {
		lastname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		firstname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		patronymic: {
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		gender: {
			presence: true
		},
		birthday: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: _18YearsAgo,
				greaterThanOrEqualTo: _90YearsAgo,
				message: '^Введите корректную дату'
			}
		},
		passport_series: {
			presence: true,
			format: {
				pattern: /^[0-9]{2} [0-9]{2}$/,
				message: '^Некорректный ввод'
			}
		},
		passport_number: {
			presence: true,
			format: {
				pattern: /^[0-9]{6}$/,
				message: '^Некорректный ввод'
			}
		},
		passport_issue_date: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: now.valueOf(),
				message: '^Введите корректную дату'
			}
		},
		passport_emitent: {
			presence: true,
		},
		phone: {
			presence: false,
			format: {
				pattern: /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
				message: '^Некорректный телефон'
			}
		},
		smscode: {
			presence: false,
			format: {
				pattern: /^[0-9]{4}$/,
				message: '^Введите SMS-код'
			}
		},
		email: {
			presence: false,
			format: {
				pattern: /^.+@\S+\.\S+$/,
				message: '^Некорректный e-mail'
			}
		},
		registration_city: {
			presence: false,
		},
		registration_street: {
			presence: false,
			format: {
				pattern: /^[^~].*|^$/,
				message: '^Необходимо изменить значение'
			}
		},
		registration_house: {
			presence: true,
		},
		registration_flat: {
			format: {
				pattern: /[0-9]{0,6}/,
				message: '^Некорректный номер квартиры'
			}
		}
	},
	insurant: {
		lastname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		firstname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		patronymic: {
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		gender: {
			presence: true
		},
		birthday: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: _18YearsAgo,
				greaterThanOrEqualTo: _90YearsAgo,
				message: '^Введите корректную дату'
			}
		},
		passport_series: {
			presence: true,
			format: {
				pattern: /^[0-9]{2} [0-9]{2}$/,
				message: '^Некорректный ввод'
			}
		},
		passport_number: {
			presence: true,
			format: {
				pattern: /^[0-9]{6}$/,
				message: '^Некорректный ввод'
			}
		},
		passport_issue_date: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: now.valueOf(),
				message: '^Введите корректную дату'
			}
		},
		passport_emitent: {
			presence: true,
		},
		phone: {
			presence: true,
			format: {
				pattern: /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
				message: '^Некорректный телефон'
			}
		},
		smscode: {
			presence: true,
			format: {
				pattern: /^[0-9]{4}$/,
				message: '^Введите SMS-код'
			}
		},
		email: {
			presence: true,
			format: {
				pattern: /^.+@\S+\.\S+$/,
				message: '^Некорректный e-mail'
			}
		},
		registration_city: {
			presence: false,
		},
		registration_street: {
			presence: false,
			format: {
				pattern: /^[^~].*|^$/,
				message: '^Необходимо изменить значение'
			}
		},
		registration_house: {
			presence: true,
		},
		registration_flat: {
			format: {
				pattern: /^[0-9]{0,6}$/,
				message: '^Некорректный номер квартиры'
			}
		},
		subscribe: {
			presence: true,
			checkbox: {
				checked: true,
				message: '^'
			}
		}
	},
	drivers: {
		lastname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		firstname: {
			presence: true,
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		patronymic: {
			format: {
				pattern: /^[а-яА-ЯёЁ-\s]+$/,
				message: '^Некорректный ввод'
			}
		},
		birthday: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: _18YearsAgo,
				greaterThanOrEqualTo: _90YearsAgo,
				message: '^Введите корректную дату'
			}
		},
		license_series: {
			presence: true,
			format: {
				pattern: /^[0-9]{2}[0-9а-яА-Яa-zA-Z]{2}$/,
				message: '^Некорректный ввод'
			}
		},
		license_number: {
			presence: true,
			format: {
				pattern: /^[0-9]{6}$/,
				message: '^Некорректный ввод'
			}
		},
		date_experience: {
			presence: true,
			numericality: {
				onlyInteger: true,
				strict: true,
				lessThanOrEqualTo: now.valueOf(),
				greaterThanOrEqualTo: _100YearsAgo,
				message: (value, attribute, validatorOptions, attributes, globalOptions) => {
					if (value < validatorOptions.greaterThanOrEqualTo) {
						return '^Получение прав невозможно ранее 16 лет';
					} else {
						return '^Введите корректную дату';
					}
				}
			}
		}
	}
};

export { Steps, multidriveItems, usagePeriodsList, constraints, now };
