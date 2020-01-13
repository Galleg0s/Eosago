'use strict';

var currentDate = new window.Date();
var currentYear = currentDate.getFullYear();

const fromDate = new Date();
fromDate.setDate(fromDate.getDate() + 1);

var CALENDAR_RANGE_VALUES = {
	policy_start_date: {
		from: {
			year: fromDate.getFullYear(),
			month: fromDate.getMonth() + 1,
			day: fromDate.getDate()
		},
		to: {
			year: currentDate.getFullYear(),
			month: currentDate.getMonth() + 1 + 3,
			day: currentDate.getDate()
		}
	},
	car_used_since: {
		from: {
			year: 1936,
			month: 1,
			day: 1
		},
		to: {
			year: currentDate.getFullYear(),
			month: currentDate.getMonth() + 1 + 3,
			day: currentDate.getDate()
		}
	},
	birthday: {
		from: {
			year: 1930,
			month: 1,
			day: 1
		},
		to: {
			year: currentDate.getFullYear() - 18,
			month: currentDate.getMonth() + 1,
			day: currentDate.getDate()
		}
	},
	issue_date: {
		from: {
			year: 1930 + 16,
			month: 1,
			day: 1
		},
		to: {
			year: currentDate.getFullYear(),
			month: currentDate.getMonth() + 1,
			day: currentDate.getDate()
		}
	}
};

var INSURANCE_TYPES = [
	{name: 'kasko', title: 'каско'},
	{name: 'osago', title: 'осаго'}
];

var TYPE_TOOLTIP = {
	kasko: 'КАСКО – добровольный вид страхования, позволяющий получить компенсацию за ущерб, причиненный вашему автомобилю.',
	osago: 'ОСАГО – обязательный вид страхования, позволяющий переложить обязанность возместить причиненный вами при ДТП ущерб третьим лицам на страховую компанию.'
};

var FRANCHISE_TOOLTIP = 'Франшиза – часть убытка, которая не будет возмещена страховщиком. Ее размер устанавливается договором и может быть обозначен либо как точная сумма в рублях, либо как доля (процент) от страховой суммы.';
var DIAGNOSTIC_CARD_TOOLTIP = 'Документ, оформляется по результатам технического осмотра автомобиля. Не требуется для автомобилей возрастом до трех лет. Для автомобилей старше трех лет оформление полиса ОСАГО без действующей диагностической карты невозможно.';
var ACCIDENT_FREE_INFO = 'Некоторым страховщикам для расчета обязательно требуются полные данные по водителям. Без заполнения этих данных расчет по таким компаниям не будет осуществлен. Заполнение полей также позволит получить точный расчет стоимости с учетом скидки за безаварийную езду.';

var PERIODS = [
	{value: 1, title: '3 месяца'},
	{value: 2, title: '4 месяца'},
	{value: 3, title: '5 месяцев'},
	{value: 4, title: '6 месяцев'},
	{value: 5, title: '7 месяцев'},
	{value: 6, title: '8 месяцев'},
	{value: 7, title: '9 месяцев'},
	{value: 8, title: '12 месяцев'}
];

var MONTHS = [
	{value: 1, title: 'январь'},
	{value: 2, title: 'февраль'},
	{value: 3, title: 'март'},
	{value: 4, title: 'апрель'},
	{value: 5, title: 'май'},
	{value: 6, title: 'июнь'},
	{value: 7, title: 'июль'},
	{value: 8, title: 'август'},
	{value: 9, title: 'сентябрь'},
	{value: 10, title: 'октябрь'},
	{value: 11, title: 'ноябрь'},
	{value: 12, title: 'декабрь'}
];

function createFranchiseList(start, stop, step) {
	var result = [{value: 0, title: 'без франшизы'}];

	for (var i = start; i <= stop; i += step) {
		result.push({value: i, title: i + ' ₽'});
	}

	return result;
}

var FRANCHISES = createFranchiseList(5000, 50000, 5000);

var REPAIR_TYPES = [
	{value: 2, title: 'по направлению Страховщика'},
	{value: 1, title: 'официальный дилер'},
	{value: 0, title: 'не имеет значения'}
];

var PARKING_TYPES = [
	{value: 0, title: 'Свободное хранение'},
	{value: 1, title: 'Охраняемая стоянка'},
	{value: 2, title: 'Гаражное хранение'}
];

var MILEAGE_TYPES = [
	{id: 0, value: 0, title: 'Без пробега', range: [currentYear, currentYear]},
	{id: 1, value: 15000, title: 'до 20 000 км', range: [currentYear - 1, currentYear - 1]},
	{id: 2, value: 35000, title: 'до 40 000 км', range: [currentYear - 2, currentYear - 3]},
	{id: 3, value: 55000, title: 'до 60 000 км', range: [currentYear - 4, currentYear - 5]},
	{id: 4, value: 75000, title: 'до 80 000 км', range: [currentYear - 6, currentYear - 7]},
	{id: 5, value: 95000, title: 'до 100 000 км', range: [currentYear - 8, currentYear - 9]},
	{id: 6, value: 110000, title: 'более 100 000 км', range: [currentYear - 10, 1936]}
];

var FIRST_OSAGO = [{value: true, title: 'да'}, {value: false, title: 'нет'}];
var DIAGNOSTIC_CARD = [{value: true, title: 'да'}, {value: false, title: 'нет'}];
var MULTIDRIVE = [{value: false, title: 'ограниченное'}, {value: true, title: 'без ограничений'}];
var ACCIDENT_FREE = [{value: false, title: 'позже (при оформлении)'}, {value: true, title: 'сейчас'}];
var SEX = [{value: 'm', title: 'муж.'}, {value: 'w', title: 'жен.'}];
var MARRIAGE = [{value: true, title: 'да'}, {value: false, title: 'нет'}];
var CHILDREN = [{value: true, title: 'да'}, {value: false, title: 'нет'}];
var AGE = [{value: false, title: 'до 22 лет включительно'}, {value: true, title: 'старше 22 лет'}];
var EXPERIENCE = [{value: false, title: 'до 3 лет включительно'}, {value: true, title: 'от 3 лет'}];

var DRIVER_COUNT = ['Первый', 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый'];

var FIELD_NAMES = {
	car: 'Автомобиль',
	price: 'Примерная стоимость автомобиля',
	franchise: 'Франшиза',
	credit_bank: 'Банк',
	region: 'Регион проживания',
	region_registration: 'Регион регистрации собственника',
	multidrive: 'Количество водителей',
	power: 'Мощность',
	age: 'Возраст',
	age_tab: 'Возраст',
	experience: 'Стаж',
	experience_tab: 'Стаж вождения',
	firstname: 'Имя',
	lastname: 'Фамилия',
	surname: 'Отчество',
	birthday: 'Дата рождения',
	'license.series': 'Серия водительского удостоверения',
	'license.number': 'Номер водительского удостоверения',
	license: 'Водительское удостоверение',
	'passport.series': 'Серия паспорта',
	'passport.number': 'Номер паспорта',
	passport: 'Паспорт',
	issue_date: 'Дата выдачи первых прав',
	vin: 'VIN номер ТС',
	accept_rules: 'Согласие с условиями передачи данных',
	accident_free: 'Рассчитать скидку за безаварийную езду',
	parking_type: 'Стоянка в ночное время',
	warranty: 'ТС на гарантии',
	policy_start_date: 'Начало действия полисов',
	car_used_since: 'Дата начала использования ТС',
	has_anti_theft_system: 'Противоугонная система (ПУС)',
	anti_theft_system: 'Наименование ПУС',
	diagnostic_card: 'У меня есть диагностическая карта'
};

var STAT_COLORS = ['#e74c3c', '#e74c3c', '#f26c63', '#ffae26', '#7dcea0', '#7dcea0', '#27ae60', '#27ae60', '#27ae60', '#27ae60', '#27ae60'];

var FormStore = {
	getInsuranceTypes: function() {
		return INSURANCE_TYPES;
	},

	getTypeTooltips: function() {
		return TYPE_TOOLTIP;
	},

	getFranchiseTooltip: function() {
		return FRANCHISE_TOOLTIP;
	},

	getFranchises: function() {
		return FRANCHISES;
	},

	getRepairTypes: function() {
		return REPAIR_TYPES;
	},

	getParkingTypes: function() {
		return PARKING_TYPES;
	},

	getMileageTypes: function() {
		return MILEAGE_TYPES;
	},

	getPeriods: function() {
		return PERIODS;
	},

	getFirstOsago: function() {
		return FIRST_OSAGO;
	},

	getDiagnosticCard: function() {
		return DIAGNOSTIC_CARD;
	},

	getDiagnosticCardTooltip: function() {
		return DIAGNOSTIC_CARD_TOOLTIP;
	},

	getMultidrive: function() {
		return MULTIDRIVE;
	},

	getAccidentFree: function() {
		return ACCIDENT_FREE;
	},

	getAccidentFreeInfo: function() {
		return ACCIDENT_FREE_INFO;
	},

	getSex: function() {
		return SEX;
	},

	getMarriage: function() {
		return MARRIAGE;
	},

	getChildren: function() {
		return CHILDREN;
	},

	getAge: function() {
		return AGE;
	},

	getExperience: function() {
		return EXPERIENCE;
	},

	getMonths: function() {
		return MONTHS;
	},

	getCalendarRanges: function(fieldName) {
		return CALENDAR_RANGE_VALUES[fieldName];
	},

	getDriverCount: function() {
		return DRIVER_COUNT;
	},

	getFieldNames: function() {
		return FIELD_NAMES;
	},

	getFieldName: function(field) {
		return FIELD_NAMES[field];
	},

	getStatColors: function() {
		return STAT_COLORS;
	}
};

module.exports = FormStore;
