import React, { useRef, useEffect } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import s from './search-controls.css';

import AsteriskIcon from 'Assets/asterisk.svg';
import Button from 'Components/button/';
import TextInput from 'Components/text-input/';
import PlusIcon from 'Assets/plus.svg';
import RefreshIcon from 'Assets/refresh.svg';

interface Props {
	onAdd(): void;
	updateTextFilter(textFilter: string): void;
	openAllVisibleBookmarks(): void;
	refreshBookmarks(): void;
	textFilter: string;
	shouldEnableSearch: boolean;
	shouldEnableActionsExclRefresh: boolean;
	numMatches: number;
}

const SearchControls: Comp<Props> = (props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const focusInput = () => {
		if (inputRef.current) inputRef.current.focus();
	};

	useEffect(focusInput, []);
	useListenToKeydown((evt) => {
		if (evt.ctrlKey && evt.key === 'l') focusInput();
	});

	return (
		<nav>
			<div className={s.wrapper}>
				<TextInput
					value={props.textFilter}
					onInput={props.updateTextFilter}
					placeholder="Search..."
					disabled={!props.shouldEnableSearch}
					className={s.search}
					ref={inputRef}
				/>

				<Button
					wrapperClassName={s['btn-wrapper']}
					tooltipClassName={s.tooltip}
					type="button"
					disabled={!props.shouldEnableActionsExclRefresh}
					onClick={props.openAllVisibleBookmarks}
					iconHTML={AsteriskIcon}
					tooltip={`Open all ${props.numMatches} matches`}
				/>

				<Button
					wrapperClassName={s['btn-wrapper']}
					tooltipClassName={s.tooltip}
					type="button"
					disabled={!props.shouldEnableActionsExclRefresh}
					onClick={props.onAdd}
					iconHTML={PlusIcon}
					tooltip="Add a bookmark"
				/>

				<Button
					className={s['btn--refresh']}
					wrapperClassName={s['btn-wrapper']}
					tooltipClassName={s.tooltip}
					type="button"
					onClick={props.refreshBookmarks}
					iconHTML={RefreshIcon}
					tooltip="Fetch bookmarks"
				/>
			</div>
		</nav>
	);
};

export default SearchControls;
