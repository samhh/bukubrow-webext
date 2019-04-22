import React, { useRef, useEffect, useState, FC } from 'react';
import { matchesTerminology } from 'Modules/terminology';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';

import IconButton, { iconButtonSize, idealFeatherIconSize } from 'Components/icon-button';
import TextInput from 'Components/text-input';
import Tooltip from 'Components/tooltip';

import { ArrowUpRight, Layers, Plus, RefreshCw } from 'react-feather';

export const headerHeight = '50px';
export const headerItemsMargin = '10px';

const Wrapper = styled.nav`
	width: 100%;
	height: ${headerHeight};
	position: fixed;
	top: 0;
	z-index: 1;
	display: grid;
	grid-template-columns: 1fr auto;
	grid-gap: .5rem;
	align-items: center;
	padding: 1rem;
	background: ${props => props.theme.backgroundColor};
`;

const SearchTextInput = styled(TextInput)`
	height: ${iconButtonSize}px;
	padding: 0 ${headerItemsMargin};
	color: ${props => props.theme.textColor};
`;

const ControlsWrapper = styled.div`
	position: relative;
`;

const ControlButtonTooltip = styled(Tooltip)`
	position: absolute;
	top: calc(50% - 1px);
	right: calc(100% + .5rem);
	transform: translateY(-50%);
`;

const ControlButton = styled(IconButton)`
	vertical-align: top;

	&:not(:last-child) {
		margin-right: .5rem;
	}
`;

interface Props {
	onStagedBookmarks(): void;
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

const SearchControls: FC<Props> = (props) => {
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
						disabled={!props.shouldEnableOpenStaged}
						onClick={props.onStagedBookmarks}
						onMouseEnter={props.shouldEnableOpenStaged
							? showTooltip(HoverState.Stage)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<Layers size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						disabled={!props.shouldEnableOpenAll}
						onClick={props.openAllVisibleBookmarks}
						onMouseEnter={props.shouldEnableOpenAll
							? showTooltip(HoverState.OpenAll)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<ArrowUpRight size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						disabled={!props.shouldEnableAddBookmark}
						onClick={props.onAdd}
						onMouseEnter={props.shouldEnableAddBookmark
							? showTooltip(HoverState.Add)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<Plus size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						onClick={props.refreshBookmarks}
						onMouseEnter={showTooltip(HoverState.Refresh)}
						onMouseLeave={hideTooltip}
					>
						<RefreshCw size={idealFeatherIconSize} />
					</ControlButton>
				</div>

				<ControlButtonTooltip
					message={tooltipMessage(hoverState)}
					visible={hoverState !== HoverState.None}
				/>
			</ControlsWrapper>
		</Wrapper>
	);
};

export default SearchControls;
