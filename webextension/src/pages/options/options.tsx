import React, { Component, FormEvent } from 'react';
import { render } from 'react-dom';
import { getSettings, saveSettings, Settings, Theme } from 'Modules/settings';
import setTheme from 'Modules/set-theme';
import sleep from 'Modules/sleep';

import TextInput from 'Components/text-input/';

interface State extends Settings {}

class OptionsPage extends Component<{}, State> {
	state = {
		theme: Theme.Light,
	};

	componentDidMount(): void {
		getSettings().then((settings) => {
			// Type assertion as undefined keys will be absent and therefore safe for
			// setState's partial object update
			this.setState(settings);
		});
	}

	// Can't figure out the correct typings for this. Anyway, as somewhat of a
	// hack we're hooking setState and syncing that up with saving the settings
	// remotely
	setState (state: any) {
		saveSettings(state);
		super.setState(state);
	}

	handleThemeChange = (evt: FormEvent<HTMLSelectElement>): void => {
		const theme = evt.currentTarget.value as Theme;

		saveSettings({ theme });
		this.setState({ theme });
	}

	render() {
		return (
			<>
				<select
					value={this.state.theme}
					onChange={this.handleThemeChange}
				>
					<option value={Theme.Light}>Light</option>
					<option value={Theme.Dark}>Dark</option>
				</select>
			</>
		);
	}
}

render(<OptionsPage />, document.querySelector('.js-root'));
