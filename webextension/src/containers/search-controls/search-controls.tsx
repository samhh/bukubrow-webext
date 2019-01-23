import React, { useRef, useEffect, SFC } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styles from './search-controls.css';

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
	numMatches: number;
}

const SearchControls: SFC<Props> = (props) => {
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
			<div className={`u-clearfix ${styles.wrapper}`}>
				<TextInput
					value={props.textFilter}
					onInput={props.updateTextFilter}
					placeholder="Search..."
					disabled={!props.shouldEnableSearch}
					className={styles.search}
					ref={inputRef}
				/>

				<Button
					className={styles.btn}
					tooltipClassName={styles.tooltip}
					type="button"
					onClick={props.openAllVisibleBookmarks}
					iconHTML={AsteriskIcon}
					tooltip={`Open all ${props.numMatches} matches`}
				/>

				<Button
					className={styles.btn}
					tooltipClassName={styles.tooltip}
					type="button"
					onClick={props.onAdd}
					iconHTML={PlusIcon}
					tooltip="Add a bookmark"
				/>

				<Button
					className={[styles.btn, styles['btn--refresh']].join(' ')}
					tooltipClassName={styles.tooltip}
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
