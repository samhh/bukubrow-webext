import React, { StrictMode, ReactNode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from '~/store';
import { ThemeProvider } from '~/styles';

/**
 * Render/mount a component with all providers supplied.
 */
const mountPage = (page: ReactNode): IO<void> => (): void => {
	render((
		<StrictMode>
			<Provider store={store}>
				<ThemeProvider>
					{page}
				</ThemeProvider>
			</Provider>
		</StrictMode>
	), document.querySelector('.js-root'));
};

export default mountPage;
