import { moneyFormat, paramObjToStr } from 'helpers';

const CURRENCY_SIGNS = {
	EUR: '€',
	RUB: '₽',
	USD: '$',
};

export const formatSum = (value, currency) => {
	const currencySign = CURRENCY_SIGNS[currency];
	return `${moneyFormat(value)} ${currencySign}`;
};

const AFF_SUB1 = 'vzr_vydacha';

const HO_LINKS = {
	ingosstrah: `https://tracking.banki.ru/aff_c?offer_id=3189&aff_id=2&url_id=5003&aff_sub1=${AFF_SUB1}`,
	vtb: `https://tracking.banki.ru/aff_c?offer_id=3215&aff_id=2&url_id=5047&aff_sub1=${AFF_SUB1}`,
	absolut: `https://tracking.banki.ru/aff_c?offer_id=3229&aff_id=2&url_id=5065&aff_sub1=${AFF_SUB1}`,
	liberty: `https://tracking.banki.ru/aff_c?offer_id=3225&aff_id=2&url_id=5061&aff_sub1=${AFF_SUB1}`,
	tinkoff: `https://tracking.banki.ru/aff_c?offer_id=3231&aff_id=2&url_id=5067&aff_sub1=${AFF_SUB1}`,
	alfa: `https://tracking.banki.ru/aff_c?offer_id=3233&aff_id=2&url_id=5069&aff_sub1=${AFF_SUB1}`,
	uralsib: `https://tracking.banki.ru/aff_c?offer_id=3227&aff_id=2&url_id=5063&aff_sub1=${AFF_SUB1}`,
	renessans: `https://tracking.banki.ru/aff_c?offer_id=3485&aff_id=2&url_id=5453&aff_sub1=${AFF_SUB1}`,
	capitallife: `https://tracking.banki.ru/aff_c?offer_id=3653&aff_id=2&url_id=5741&aff_sub1=${AFF_SUB1}`,
};

export function getPurchaseLink(companyCode, getParams) {
	const baseLink = HO_LINKS[companyCode];
	if (!baseLink) {
		return null;
	}
	return `${baseLink}&${paramObjToStr(getParams)}`;
}
