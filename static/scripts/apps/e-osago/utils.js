export function setKladrIdToLocations(
	region_kladr_id = undefined,
	settlement_kladr_id = undefined,
	city_kladr_id = undefined,
	street_kladr_id = undefined,
	area_kladr_id = undefined
) {
	let resultKladrId;
	if (street_kladr_id) {
		resultKladrId = street_kladr_id;
	} else if (settlement_kladr_id) {
		resultKladrId = settlement_kladr_id;
	} else if (area_kladr_id) {
		resultKladrId = area_kladr_id;
	} else if (city_kladr_id) {
		resultKladrId = city_kladr_id;
	} else if (region_kladr_id) {
		resultKladrId = region_kladr_id;
	} else {
		resultKladrId = undefined;
	}
	return { kladr_id: resultKladrId };
}

export function convertTimestampToStr(timestamp) {
	let date_obj = new Date();
	date_obj.setTime(timestamp);
	return `${date_obj.getFullYear()}-${date_obj.getMonth() + 1}-${date_obj.getDate()}`;
}

export function convertTimestampToObj(timestamp) {
	return {
		day: (new Date(timestamp)).getDate(),
		month: (new Date(timestamp)).getMonth() + 1,
		year: (new Date(timestamp)).getFullYear()
	};
}

export function clearPhoneNumber(phoneString) {
	const extraSymbols = new RegExp(/[-()\s]/g);
	return phoneString && phoneString.replace(extraSymbols,'');
}

/**
 * @function Функция преобразования результатов осаго для сохранения в store
 * @params {Object} allResults - объект всех результатов
 * @params {int} id - id компании по которой происходит рассчет
 * @return {Object} paperPolicy - бумажный полис осаго, соответствующий рассчитываемому еОСАГО
 * @return {Array} allPaperPolicies - остальные бумажные полисы, доступные для приобретения.
 */
export function transformPaperPolices(allResults, id) {
	const allPaperPolicies = [];
	const paperPolicy = {};
	Object.keys(allResults).forEach((key) => {
		allResults[key].forEach((policy) => {
			// policy.products.osago.type === 6 - eOSAGO policy
			policy.products.osago.type !== 6 && policy.company.id !== id && Object.keys(policy.leads).length && allPaperPolicies.push(policy);
			policy.products.osago.type !== 6 && policy.company.id === id && Object.keys(paperPolicy).length === 0 && Object.assign(paperPolicy, policy);
		});
	});
	return {paperPolicy, allPaperPolicies};
}

/**
 * @function Функция преобразования номера мобильного телефона
 * @param {String} phone - исходная строка номера, длиной 10, 11 или 12 символов, иначе return undefined
 * @returns {String} - возвращается строка номера телефона в формате "+9 (999) 999-99-99"
 */
export function beautifyPhone(phone) {
	if (phone.length === 12) {
		return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10, 12)}`;
	} else if (phone.length === 11) {
		return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`;
	} else if (phone.length === 10) {
		return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
	}
}

export function scrollToField(element) {
	setTimeout(() => {
		element.scrollIntoView(true);
	}, 100);
}

export const getAddressValue = data => {
	if (data.registration_region) {
		return {
			area: data.registration_area || null,
			area_with_type: data.registration_area || null,
			area_kladr_id: data.registration_area_kladr_id || null,
			city: data.registration_city || null,
			city_with_type: data.registration_city || null,
			city_kladr_id: data.registration_city_kladr_id || null,
			flat: data.registration_flat || null,
			house: data.registration_house || null,
			name: `${data.registration_region} ${data.registration_city || data.registration_settlement || ''} ${data.registration_street || ''} ${data.registration_house || ''} ${data.registration_flat || ''}`,
			region: data.registration_region || null,
			region_with_type: data.registration_region || null,
			region_kladr_id: data.registration_region_kladr_id || null,
			settlement: data.registration_settlement || null,
			settlement_with_type: data.registration_settlement || null,
			settlement_kladr_id: data.registration_settlement_kladr_id || null,
			street: data.registration_street || null,
			street_with_type: data.registration_street || null,
			street_kladr_id: data.registration_street_kladr_id || null,
			postal_code: data.registration_postcode || null,
		};
	}

	return null;
};

export const falseFunc = () => false;
