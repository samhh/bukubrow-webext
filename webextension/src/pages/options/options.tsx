import React, { FormEvent, FC } from 'react';
import { saveSettings, Theme, isTheme } from 'Modules/settings';
import styled from 'Styles';

const Page = styled.main`
	padding: 2.5rem;
`;

interface Props {
	activeTheme: Theme;
	setActiveTheme(theme: Theme): void;
}

const OptionsPage: FC<Props> = (props) => {
	const handleThemeChange = (evt: FormEvent<HTMLSelectElement>) => {
		const theme = evt.currentTarget.value;

		if (!isTheme(theme)) return;

		props.setActiveTheme(theme);
		saveSettings({ theme });
	};

	return (
		<Page>
			<select
				value={props.activeTheme}
				onChange={handleThemeChange}
			>
				<option value={Theme.Light}>Light</option>
				<option value={Theme.Dark}>Dark</option>
			</select>
		</Page>
	);
};

export default OptionsPage;
