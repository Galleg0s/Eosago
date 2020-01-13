import {combineReducers} from 'redux';
import form from './form';
import formSteps from './formSteps';
import modals from './modals';
import phoneVerification from './phoneVerification';
import autoCatalog from './autoCatalog';
import auto from './auto';
import results from './results';

const rootReducer = combineReducers({
	formSteps: formSteps,
	modals,
	form,
	phoneVerification,
	autoCatalog,
	auto,
	results,
});

export default rootReducer;
