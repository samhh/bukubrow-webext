import React, { Component, StrictMode, FormEvent } from 'react';
import { render } from 'react-dom';
import { getSettings, saveSettings, Settings, Theme } from 'Modules/settings';

type State = Settings;

class OptionsPage extends Component<{}, State> {
	state = {
		theme: Theme.Light,
	};

	async componentDidMount() {
		const settings = await getSettings();

		// Type assertion because React state typings dislike Partials
		this.setState(settings as Settings, this.syncState);
	}

	syncState() {
		saveSettings(this.state);
	}

	handleThemeChange = (evt: FormEvent<HTMLSelectElement>) => {
		// Type assertion as we wholly control this value
		const theme = evt.currentTarget.value as Theme;

		this.setState({ theme }, this.syncState);
	}

	render() {
		return (
			<StrictMode>
				<select
					value={this.state.theme}
					onChange={this.handleThemeChange}
				>
					<option value={Theme.Light}>Light</option>
					<option value={Theme.Dark}>Dark</option>
				</select>
			</StrictMode>
		);
	}
}

render(<OptionsPage />, document.querySelector('.js-root'));
