import Url from 'utils.url';

const COMPANIES_ID_LIST = {
	INGOSSTRAKH: 3,
	SOGLASIE: 5,
	ALPHA: 6,
	ALPHA_PLUS: 4407,
	NASKO: 43,
	ROSGOSSTRAKH: 123,
	TINKOFF: 127,
	VSK: 7,
	RENAISSANCE: 11,
	OSK: 89,
	ZETTA: 23,
	VERNA: 384,
	LIBERTY: 50,
	UGORIA: 32,
	ASTRO_VOLGA: 135,
	ABSOLUTE: 328,
	GAIDE: 128,
};

const OFFER_ID_LIST = {
	[COMPANIES_ID_LIST.VSK]: 4328,
	[COMPANIES_ID_LIST.RENAISSANCE]: 4329,
	[COMPANIES_ID_LIST.ZETTA]: 4330,
	[COMPANIES_ID_LIST.ABSOLUTE]: 4331,
	[COMPANIES_ID_LIST.OSK]: 4332,
	[COMPANIES_ID_LIST.VERNA]: 4333,
	[COMPANIES_ID_LIST.GAIDE]: 4334,
	[COMPANIES_ID_LIST.LIBERTY]: 4335,
	[COMPANIES_ID_LIST.UGORIA]: 4336,
	[COMPANIES_ID_LIST.ASTRO_VOLGA]: 4337,
	[COMPANIES_ID_LIST.INGOSSTRAKH]: 2301,
	[COMPANIES_ID_LIST.ALPHA]: 2299,
	[COMPANIES_ID_LIST.ALPHA_PLUS]: 2299,
	[COMPANIES_ID_LIST.TINKOFF]: 3691,
	[COMPANIES_ID_LIST.ROSGOSSTRAKH]: 3729,
	[COMPANIES_ID_LIST.SOGLASIE]: 3845,
	[COMPANIES_ID_LIST.NASKO]: 3898,
};

const URL_ID_LIST = {
	[COMPANIES_ID_LIST.VSK]: 7547,
	[COMPANIES_ID_LIST.RENAISSANCE]: 7549,
	[COMPANIES_ID_LIST.ZETTA]: 7550,
	[COMPANIES_ID_LIST.ABSOLUTE]: 7551,
	[COMPANIES_ID_LIST.OSK]: 7552,
	[COMPANIES_ID_LIST.VERNA]: 7553,
	[COMPANIES_ID_LIST.GAIDE]: 7554,
	[COMPANIES_ID_LIST.LIBERTY]: 7555,
	[COMPANIES_ID_LIST.UGORIA]: 7556,
	[COMPANIES_ID_LIST.ASTRO_VOLGA]: 7557,
	[COMPANIES_ID_LIST.INGOSSTRAKH]: 3427,
	[COMPANIES_ID_LIST.ALPHA]: 3425,
	[COMPANIES_ID_LIST.ALPHA_PLUS]: 3425,
	[COMPANIES_ID_LIST.TINKOFF]: 5833,
	[COMPANIES_ID_LIST.ROSGOSSTRAKH]: 5915,
	[COMPANIES_ID_LIST.SOGLASIE]: 6193,
	[COMPANIES_ID_LIST.NASKO]: 6320,
};

export const SUB_ID_LIST = {
	[COMPANIES_ID_LIST.VSK]: 'SL1hO',
	[COMPANIES_ID_LIST.RENAISSANCE]: 'SL1hS',
	[COMPANIES_ID_LIST.ZETTA]: 'SL1hT',
	[COMPANIES_ID_LIST.ABSOLUTE]: 'SL1hU',
	[COMPANIES_ID_LIST.OSK]: 'SL1hV',
	[COMPANIES_ID_LIST.VERNA]: 'SL1hW',
	[COMPANIES_ID_LIST.GAIDE]: 'SL1hX',
	[COMPANIES_ID_LIST.LIBERTY]: 'SL1hY',
	[COMPANIES_ID_LIST.UGORIA]: 'SL1hZ',
	[COMPANIES_ID_LIST.ASTRO_VOLGA]: 'SL1ha',
	[COMPANIES_ID_LIST.INGOSSTRAKH]: 'GLpX',
	[COMPANIES_ID_LIST.ALPHA]: 'GLpP',
	[COMPANIES_ID_LIST.ALPHA_PLUS]: 'GLpP',
	[COMPANIES_ID_LIST.TINKOFF]: 'GL1K5',
	[COMPANIES_ID_LIST.ROSGOSSTRAKH]: 'GL1L7',
	[COMPANIES_ID_LIST.SOGLASIE]: 'GL1S7',
	[COMPANIES_ID_LIST.NASKO]: 'SL1Ua',
};

export default function addTrackingElement(queryParams:any, companyId: number) {
	const getCalculationId = () => {
		const { id: calculationHash } = Url(window.location.href).getParams();
		const calculationHashArray = calculationHash && calculationHash.split(':');
		const calculationId = calculationHashArray && calculationHashArray[0];

		return calculationId;
	};

	const getQueryString = (queryParams:any, companyId: number) => {
		const getQueryValue = (queryKey: string) => {
			switch (queryKey) {
				case 'adv_sub':
					return `adv_sub=${getCalculationId()}`;
				case 'url_id':
					return URL_ID_LIST[companyId] ? `url_id=${URL_ID_LIST[companyId]}` : '';
				case 'offer_id':
					return OFFER_ID_LIST[companyId] ? `offer_id=${OFFER_ID_LIST[companyId]}` : '';
				case 'aff_id':
					return 'aff_id=2';
				case 'sub_id':
					return SUB_ID_LIST[companyId] ? `${SUB_ID_LIST[companyId]}` : '';
				case 'aff_c':
					return 'aff_c';
				default:
					return '';
			}
		};

		return queryParams.reduce((acc:string, curr:string, index: number, params: any) => {
			const getSeparator = (queryPosition:number) => {
				switch (queryPosition) {
					case 0:
						return '?';
					case params.length - 1:
						return '';
					default:
						return '&';
				}
			};

			return acc + getQueryValue(curr) + getSeparator(index);
		}, '');
	};


	let trackingUrl = 'https://tracking.banki.ru/';
	trackingUrl += getQueryString(queryParams, companyId);

	const trackingElement = new Image();
	trackingElement.src = trackingUrl;

	return trackingElement;
}
