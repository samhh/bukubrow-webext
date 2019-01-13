import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import OptionsPage from 'Pages/options/';
import '../global.css';

render((
	<StrictMode>
		<OptionsPage />
	</StrictMode>
), document.querySelector('.js-root'));
