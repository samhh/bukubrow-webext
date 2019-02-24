import React, { StrictMode, ReactNode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'Store';
import { ThemeProviderWithState } from 'Styles';

const mountPage = (page: ReactNode) => {
	render((
		<StrictMode>
			<Provider store={store}>
				<ThemeProviderWithState>
					{page}
				</ThemeProviderWithState>
			</Provider>
		</StrictMode>
	), document.querySelector('.js-root'));
};

export default mountPage;
