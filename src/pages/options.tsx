import React, { useState, useEffect, FC, FormEvent } from 'react';
import * as O from 'fp-ts/lib/Option';
import * as EO from '~~/modules/eitherOption';
import { useDispatch, useSelector } from '~~/store';
import { setActiveTheme } from '~~/store/user/actions';
import { saveSettings, getBadgeDisplayOpt, Theme, BadgeDisplay, isTheme, isBadgeDisplayOpt } from '~~/modules/settings';
import { sendIsomorphicMessage, IsomorphicMessage } from '~~/modules/comms/isomorphic';
import styled from '~~/styles';
import Button from '~~/components/button';
import { runTask } from '~~/modules/fp';

const Page = styled.main`
	padding: 2.5rem;
`;

const OptionsPage: FC = () => {
	const activeTheme = useSelector(state => state.user.activeTheme);
	const dispatch = useDispatch();

	const [themeOpt, setThemeOpt] = useState(activeTheme);
	const [badgeOpt, setBadgeOpt] = useState(BadgeDisplay.WithCount);

	useEffect(() => {
		getBadgeDisplayOpt().then((res) => {
			if (EO.isRightSome(res)) {
				setBadgeOpt(res.right.value);
			}
		});
	}, []);

	useEffect(() => {
		setThemeOpt(activeTheme);
	}, [activeTheme]);

	const handleThemeOptChange = (evt: FormEvent<HTMLSelectElement>): void => {
		const themeOpt = evt.currentTarget.value;
		if (!isTheme(themeOpt)) return;

		setThemeOpt(themeOpt);
	};

	const handleBadgeOptChange = (evt: FormEvent<HTMLSelectElement>): void => {
		const badgeOpt = evt.currentTarget.value;
		if (!isBadgeDisplayOpt(badgeOpt)) return;

		setBadgeOpt(badgeOpt);
	};

	const handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
		evt.preventDefault();

		dispatch(setActiveTheme(themeOpt));
		sendIsomorphicMessage(IsomorphicMessage.SettingsUpdated);
		runTask(saveSettings({ theme: O.some(themeOpt), badgeDisplay: O.some(badgeOpt) }));
	};

	return (
		<Page>
			<form onSubmit={handleSubmit}>
				Theme:&nbsp;
				<select value={themeOpt} onChange={handleThemeOptChange}>
					<option value={Theme.Light}>Light</option>
					<option value={Theme.Dark}>Dark</option>
				</select>

				<br />
				<br />
				Badge:&nbsp;
				<select value={badgeOpt} onChange={handleBadgeOptChange}>
					<option value={BadgeDisplay.WithCount}>Badge with count</option>
					<option value={BadgeDisplay.WithoutCount}>Badge without count</option>
					<option value={BadgeDisplay.None}>No badge</option>
				</select>

				<br />
				<br />
				<Button type="submit">Save Settings</Button>
			</form>
		</Page>
	);
};

export default OptionsPage;

