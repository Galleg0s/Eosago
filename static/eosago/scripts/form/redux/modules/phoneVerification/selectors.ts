import {State} from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/types';

export const isCodeFieldVisibleSelector = (state: State): boolean => state.phoneVerification.isPhoneRequire && !state.phoneVerification.isCodeValid && state.phoneVerification.didCodeRequested;
export const repeatCounterSelector = (state: State): number => state.phoneVerification.repeatCounter;
export const isCodeRequestingSelector = (state: State): boolean => state.phoneVerification.isCodeRequesting;
export const isCodeSendingSelector = (state: State): boolean => state.phoneVerification.isCodeSending;
export const isPhoneVerifiedSelector = (state: State): boolean => !state.phoneVerification.isPhoneRequire || state.phoneVerification.isCodeValid;
export const isCodeErrorSelector = (state: State): boolean => state.phoneVerification.didCodeSent && !state.phoneVerification.isCodeValid;
