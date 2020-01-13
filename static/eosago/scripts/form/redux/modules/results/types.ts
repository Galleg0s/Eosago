export interface Company {
	id: number;
	name: string;
	url: string;
	logo: string;
	premium: boolean;
	licenses: string;
	phones: Array<{ phone: string }>;
	is_sponsor: boolean;
	showLogo: boolean;
	is_special_premium: boolean;
	special_premium_text: string;
}

export interface Policy {
	price: any;
	partner_id: number;
	company: Company;
	premium_sum: number;
	chosen_by_user: boolean;
	check_result_id: number;
	is_prolongation: boolean;
	status: PolicyStatusValue;
	status_title: PolicyStatusName;
}

export type RequestStatus = 'IDLE' | 'PENDING' | 'RESOLVED' | 'REJECTED' | 'POLLING';
export type PolicyStatusValue = 1 | 2 | 3;
export type PolicyStatusName = 'pending' | 'accept' | 'decline';
