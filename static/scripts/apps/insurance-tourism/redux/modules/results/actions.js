/** GA actions */
export const sendPackageDetailViewAction = (companyCode, packageId) => (dispatch, getState) => {
	pushGtmEvent('VZR_SERVIS', 'click_details', `${companyCode}-${packageId}`, undefined);
};

export const sendOtherPackagesClickAction = (companyCode) => (dispatch, getState) => {
	pushGtmEvent('VZR_SERVIS', 'click_eshche_predlozheniya', companyCode, undefined);
};
