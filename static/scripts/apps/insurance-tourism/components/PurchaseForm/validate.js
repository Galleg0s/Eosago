import { formatDate } from '../../utils/utils';

const dateMatch = new RegExp('(19|20)\\d\\d-((0[1-9]|1[012])-(0[1-9]|[12]\\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)');
const today = new Date();
const todayMinus18 = new Date().setFullYear(new Date().getFullYear() - 18);
const nameMatch = /^[A-Za-z -]*/i;

export default function validate({insuredList, insurer = {}}, props) {
	const errors = {};

	const touristsArrayErrors = _validateInsuredList(insuredList);
	if (touristsArrayErrors.length) {
		errors.insuredList = { ...touristsArrayErrors };
	}

	errors.insurer = _validateInsurer(insurer, props);

	return errors;
}

function _getDateValue(dateStr) {
	return (dateStr.split('-').length === 3 && new Date(dateStr)) || new Date(formatDate(dateStr));
}

function _matchRegExp(value, regexp, errMsg) {
	const match = value.match(regexp);
	if (!match || !match[0] || match[0] !== match.input) {
		return errMsg
	} else {
		return null;
	}
}

function _validateInsurerPassport({ passport, birthDate }) {
	const insurerPassportErrors = {};

	if (!passport.series) {
		insurerPassportErrors.series = 'Укажите серию паспорта';
	} else {
		insurerPassportErrors.series = _matchRegExp(passport.series, /[\d]{4}/, 'Укажите серию паспорта (4 цифры)');
	}

	if (!passport.number) {
		insurerPassportErrors.number = 'Укажите номер паспорта';
	} else {
		insurerPassportErrors.number = _matchRegExp(passport.number, /[\d]{6}/, 'Укажите номер паспорта (6 цифр)');
	}

	if (!passport.issueOrganizationCode) {
		insurerPassportErrors.issueOrganizationCode = 'Укажите код подразделения';
	} else {
		insurerPassportErrors.issueOrganizationCode = _matchRegExp(
			passport.issueOrganizationCode,
			/[\d]{3}-[\d]{3}/,
			'Укажите код подразделения (6 цифр)'
		);
	}

	const issueDate = passport.issueDate && _getDateValue(passport.issueDate);
	const birthDateValue = birthDate && _getDateValue(birthDate);
	const minIssueDate = birthDateValue && birthDateValue.setFullYear(birthDateValue.getFullYear() + 14);
	if (!passport.issueDate) {
		insurerPassportErrors.issueDate = 'Укажите дату выдачи';
	} else if (!passport.issueDate.match(dateMatch) || issueDate > today || issueDate < minIssueDate) {
		insurerPassportErrors.issueDate = 'Укажите корректную дату';
	}

	if (!passport.issueOrganization) {
		insurerPassportErrors.issueOrganization = 'Укажите кем был выдан паспорт';
	} else {
		if (passport.issueOrganization.length < 3) {
			insurerPassportErrors.issueOrganization = 'Минимум 3 символа';
		}
		if (!passport.issueOrganization.length > 255) {
			insurerPassportErrors.issueOrganization = 'Максимум 255 символов';
		}
	}

	return insurerPassportErrors;
}

function _validateInsurer(insurer, props) {
	const insurerErrors = {};
	const { company: { code }, priceValue } = props;

	if (insurer) {
		const birthDateValue = insurer.birthDate && _getDateValue(insurer.birthDate);
		if (!insurer.name) {
			insurerErrors.name = 'Укажите фамилию, имя, отчество';
		} else {
			if (code === 'vsk') {
				const match = insurer.name.match(/[A-z \-]*/);
				if (match && match[0] && match.input === match[0]) {
					insurerErrors.name = _validateInsurerName(insurer.name);
				} else {
					insurerErrors.name = 'Фамилия, имя, отчество должны быть указаны латиницей';
				}
			} else {
				const match = insurer.name.match(/[А-я \-]*/);
				if (match && match[0] && match.input === match[0]) {
					insurerErrors.name = _validateInsurerName(insurer.name);
				} else {
					insurerErrors.name = 'Фамилия, имя, отчество должны быть указаны на русском языке ';
				}
			}
		}

		if (!insurer.email) {
			insurerErrors.email = 'Укажите e-mail';
		} else {
			insurerErrors.email = _matchRegExp(
				insurer.email,
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Указан некорректный адрес электронной почты'
			);
		}

		if (!insurer.phone) {
			insurerErrors.phone = 'Укажите телефон';
		} else {
			insurerErrors.phone = _matchRegExp(insurer.phone, /^\+7 \d{3} \d{3} \d{2} \d{2}$/, 'Указан некорректный телефонный номер');
		}

		if (!insurer.birthDate || (insurer.birthDate && insurer.birthDate.indexOf('_') !== -1)) {
			insurerErrors.birthDate = 'Укажите дату рождения';
		} else if (!insurer.birthDate.match(dateMatch)) {
			insurerErrors.birthDate = 'Укажите корректную дату рождения';
		} else if (todayMinus18 < birthDateValue) {
			insurerErrors.birthDate = 'Покупатель должен быть старше 18';
		}

		if (code === 'capitallife' && priceValue >= 15000) {
			if (!insurer.passport) {
				insurer.passport = {};
			}
			insurerErrors.passport = _validateInsurerPassport(insurer);
		}
	}

	return insurerErrors;
}

function _validateInsuredList(insuredList) {
	const touristsArrayErrors = [];

	if (insuredList && insuredList.length) {
		insuredList.forEach((item, index) => {
			const touristErrors = {};
			const birthDate = item.birthDate && _getDateValue(item.birthDate);
			if (!item.firstName) {
				touristErrors.firstName = 'Укажите имя';
			} else {
				touristErrors.firstName = _matchRegExp(item.firstName, nameMatch, 'Имя должно быть указано латиницей');
			}
			if (!item.lastName) {
				touristErrors.lastName = 'Укажите фамилию';
			} else {
				touristErrors.lastName = _matchRegExp(item.lastName, nameMatch, 'Фамилия должна быть указана латиницей');
			}
			if (!item.birthDate || (item.birthDate && item.birthDate.indexOf('_') !== -1)) {
				touristErrors.birthDate = 'Укажите дату рождения';
			} else if (!item.birthDate.match(dateMatch) || today < birthDate) {
				touristErrors.birthDate = 'Укажите корректную дату рождения';
			}
			touristsArrayErrors[index] = touristErrors;
		});
	}

	return touristsArrayErrors;
}

function _validateInsurerName(name) {
	const [lastName, firstName, patronymic] = name.split(' ');
	if (!lastName) {
		return 'Укажите фамилию';
	} else if (!firstName) {
		return 'Укажите имя';
	} else if (!patronymic) {
		return 'Укажите отчество';
	}
}
