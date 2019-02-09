import React, { FormEvent, useState, useEffect } from 'react';
import { getSettings, saveSettings, Settings, Theme } from 'Modules/settings';
import s from './options.css';

const OptionsPage: Comp<{}> = () => {
	const [theme, setThemeState] = useState(Theme.Light);

	const setSettings = (settings: Partial<Settings>) => {
		if (settings.theme) setThemeState(settings.theme);

		saveSettings(settings);
	};

	useEffect(() => {
		getSettings().then(setSettings);
	}, []);

	const handleThemeChange = (evt: FormEvent<HTMLSelectElement>) => {
		// Type assertion is safe as we wholly control this value
		const theme = evt.currentTarget.value as Theme;

		setSettings({ theme });
	};

	return (
		<main className={s.page}>
			<select
				value={theme}
				onChange={handleThemeChange}
			>
				<option value={Theme.Light}>Light</option>
				<option value={Theme.Dark}>Dark</option>
			</select>
		</main>
	);
};

export default OptionsPage;
