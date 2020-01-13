import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore, { history } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/redux';
import App from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/App';

interface Params {
	busUrl: string
}

const render = (element: HTMLElement, params: Params) => {
	const store = configureStore(params.busUrl);

	ReactDOM.render(
		<AppContainer>
			<Provider store={ store }>
				<App history={ history } />
			</Provider>
		</AppContainer>,
		element
	);
};

export default render;
