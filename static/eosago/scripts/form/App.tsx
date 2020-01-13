import React from 'react';
import { History } from 'history';
import Media from 'react-media';
import { ConnectedRouter } from 'connected-react-router';
import Form from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/Form';
import { Redirect, Route, Switch } from 'react-router';
import { Paths } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/paths';
import Results from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/Results';
import Url from 'utils.url';
import { MOBILE_DEVICE_WIDTH } from '@BUNDLES/InsuranceBundle/Resources/static/eosago/scripts/form/constants';


interface AppProps {
	history: History,
}

function App({ history }: AppProps) {
	let { licensePlate } = Url(window.location.href).getParams();
	if (licensePlate) {
		licensePlate = decodeURIComponent(licensePlate);
	}

	return (
		<Media query={ {maxWidth: MOBILE_DEVICE_WIDTH - 1} }>
			{ (isMobile: boolean) => (
				<ConnectedRouter history={ history }>
					<Switch>
						<Route path={ Paths.form }
							render={ (routeProps) => <Form isMobile={ isMobile } licensePlate={ licensePlate } { ...routeProps } /> }
						/>
						<Route path={ Paths.results } component={ Results } />
						<Redirect from="/" to={ Paths.form } />
					</Switch>
				</ConnectedRouter>
			) }
		</Media>
	)
}

export default App
