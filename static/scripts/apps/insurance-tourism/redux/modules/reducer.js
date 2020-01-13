import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import countries from './countries';
import search from './search';
import companies from './companies';
import packages from './packages';
import results from './results';
import options from './options';
import purchase from './purchase';
import runtime from './runtime';
import modals from './modals';

export default combineReducers({
	runtime,
	search,
	purchase,
	modals,
	entities: combineReducers({
		companies,
		countries,
		packages,
		results,
		options,
	}),
	form: formReducer,
});
