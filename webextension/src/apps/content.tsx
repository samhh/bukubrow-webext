import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'Store';
import ContentPage from 'Pages/content/';
import '../global.css';

render((
	<StrictMode>
		<Provider store={store}>
			<ContentPage />
		</Provider>
	</StrictMode>
), document.querySelector('.js-root'));
