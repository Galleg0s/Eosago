export const getRequestStatus = (state: { results: { requestStatus: string } }) => state.results.requestStatus;
export const getResultInfoRequestStatus = (state: { results: { resultInfoRequestStatus: string } }) => state.results.resultInfoRequestStatus;
export const getPolicies = (state: { results: { policies: any } }) => state.results.policies;
export const getPaymentUrl = (state: { results: { paymentUrl: string } }) => state.results.paymentUrl;
