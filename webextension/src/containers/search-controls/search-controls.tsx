import React, { useRef, useEffect, useState } from 'react';
import { matchesTerminology } from 'Modules/terminology';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';

import AsteriskIcon from 'Assets/asterisk.svg';
import Button, { buttonIconSize } from 'Components/button';
import TextInput from 'Components/text-input';
import Tooltip from 'Components/tooltip';
import PlusIcon from 'Assets/plus.svg';
import RefreshIcon from 'Assets/refresh.svg';

export const headerHeight = '50px';
export const headerItemsMargin = '10px';

const Wrapper = styled.div`
	width: 100%;
	height: ${headerHeight};
	position: fixed;
	top: 0;
	z-index: 1;
	display: grid;
	grid-template-columns: 1fr auto;
	grid-gap: .5rem;
	padding: 1rem;
	background: ${props => props.theme.backgroundColor};
`;

const SearchTextInput = styled(TextInput)`
	height: ${buttonIconSize};
	padding: 0 ${headerItemsMargin};
	color: ${props => props.theme.textColor};
`;

const ControlsWrapper = styled.div`
	position: relative;
`;

const ControlButtonTooltip = styled(Tooltip)`
	position: absolute;
	top: 50%;
	right: calc(100% + .5rem);
	transform: translateY(-50%);
`;

const ControlButton = styled(Button)`
	vertical-align: top;

	&:not(:last-child) {
		margin-right: .5rem;
	}
`;

// For poorly spaced SVG
const RefreshControlButton = styled(ControlButton)`
	padding: 2px;
`;

interface Props {
	onAdd(): void;
	updateTextFilter(textFilter: string): void;
	openAllVisibleBookmarks(): void;
	refreshBookmarks(): void;
	textFilter: string;
	shouldEnableSearch: boolean;
	shouldEnableOpenStaged: boolean;
	shouldEnableOpenAll: boolean;
	shouldEnableAddBookmark: boolean;
	numMatches: number;
}

enum HoverState {
	None,
	Stage,
	OpenAll,
	Add,
	Refresh,
}

const SearchControls: Comp<Props> = (props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [hoverState, setHoverState] = useState(HoverState.None);

	const focusInput = () => {
		if (props.shouldEnableSearch && inputRef.current) inputRef.current.focus();
	};

	useEffect(focusInput, [props.shouldEnableSearch]);
	useListenToKeydown((evt) => {
		if (evt.ctrlKey && evt.key === 'l') focusInput();
	});

	const showTooltip = (state: HoverState) => () => {
		setHoverState(state);
	};

	const hideTooltip = () => {
		setHoverState(HoverState.None);
	};

	const tooltipMessage = (state: HoverState): string => {
		switch (state) {
			case HoverState.Stage: return 'Open staging area';
			case HoverState.OpenAll: return matchesTerminology(props.numMatches);
			case HoverState.Add: return 'Add a bookmark';
			case HoverState.Refresh: return 'Fetch bookmarks';
			case HoverState.None: return '';
		}
	};

	return (
		<nav>
			<Wrapper>
				<SearchTextInput
					value={props.textFilter}
					onInput={props.updateTextFilter}
					placeholder="Search..."
					disabled={!props.shouldEnableSearch}
					ref={inputRef}
				/>

				<ControlsWrapper>
					<div>
						<ControlButton
							type="button"
							disabled={!props.shouldEnableOpenStaged}
							onClick={() => { /* TODO incl/ icon below */ }}
							iconHTML={AsteriskIcon}
							onMouseEnter={props.shouldEnableOpenStaged
								? showTooltip(HoverState.Stage)
								: undefined
							}
							onMouseLeave={hideTooltip}
						/>

						<ControlButton
							type="button"
							disabled={!props.shouldEnableOpenAll}
							onClick={props.openAllVisibleBookmarks}
							iconHTML={AsteriskIcon}
							onMouseEnter={props.shouldEnableOpenAll
								? showTooltip(HoverState.OpenAll)
								: undefined
							}
							onMouseLeave={hideTooltip}
						/>

						<ControlButton
							type="button"
							disabled={!props.shouldEnableAddBookmark}
							onClick={props.onAdd}
							iconHTML={PlusIcon}
							onMouseEnter={props.shouldEnableAddBookmark
								? showTooltip(HoverState.Add)
								: undefined
							}
							onMouseLeave={hideTooltip}
						/>

						<RefreshControlButton
							type="button"
							onClick={props.refreshBookmarks}
							iconHTML={RefreshIcon}
							onMouseEnter={showTooltip(HoverState.Refresh)}
							onMouseLeave={hideTooltip}
						/>
					</div>

					<ControlButtonTooltip
						message={tooltipMessage(hoverState)}
						visible={hoverState !== HoverState.None}
					/>
				</ControlsWrapper>
			</Wrapper>
		</nav>
	);
};

export default SearchControls;
