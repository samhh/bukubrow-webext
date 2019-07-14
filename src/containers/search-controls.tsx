import React, { useRef, useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from 'Store';
import { setSearchFilterWithResets } from 'Store/epics';
import { getUnlimitedFilteredBookmarks } from 'Store/selectors';
import { setDisplayOpenAllBookmarksConfirmation, setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';
import { scrollToTop } from 'Modules/scroll-window';
import { matchesTerminology } from 'Modules/terminology';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';
import IconButton, { iconButtonSize, idealFeatherIconSize } from 'Components/icon-button';
import TextInput from 'Components/text-input';
import Tooltip from 'Components/tooltip';
import { ArrowUpRight, Layers, Plus } from 'react-feather';

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

enum HoverState {
	None,
	Stage,
	OpenAll,
	Add,
}

const SearchControls: FC = () => {
	const allBookmarks = useSelector(state => state.bookmarks.bookmarks);
	const hasBinaryComms = useSelector(state => state.user.hasBinaryComms);
	const numStagedItems = useSelector(state => state.bookmarks.stagedBookmarksGroups.length);
	const numFilteredBookmarks = useSelector(getUnlimitedFilteredBookmarks).length;
	const textFilter = useSelector(state => state.input.searchFilter);
	const dispatch = useDispatch();

	const shouldEnableSearch = !!allBookmarks.length;
	const shouldEnableOpenStaged = hasBinaryComms && !!numStagedItems;
	const shouldEnableOpenAll = !!numFilteredBookmarks;
	const shouldEnableAddBookmark = hasBinaryComms;


	const inputRef = useRef<HTMLInputElement>(null);
	const [hoverState, setHoverState] = useState(HoverState.None);

	const focusInput = () => {
		if (shouldEnableSearch && inputRef.current) inputRef.current.focus();
	};
	useEffect(focusInput, [shouldEnableSearch]);

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
			case HoverState.OpenAll: return matchesTerminology(numFilteredBookmarks);
			case HoverState.Add: return 'Add a bookmark';
			case HoverState.None: return '';
		}
	};

	return (
		<Wrapper>
			<SearchTextInput
				value={textFilter}
				onInput={(text) => {
					dispatch(setSearchFilterWithResets(text));
					scrollToTop();
				}}
				placeholder="Search..."
				disabled={!shouldEnableSearch}
				ref={inputRef}
			/>

			<ControlsWrapper>
				<div>
					<ControlButton
						disabled={!shouldEnableOpenStaged}
						onClick={() => dispatch(setPage(Page.StagedGroupsList))}
						onMouseEnter={shouldEnableOpenStaged
							? showTooltip(HoverState.Stage)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<Layers size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						disabled={!shouldEnableOpenAll}
						onClick={() => dispatch(setDisplayOpenAllBookmarksConfirmation(true))}
						onMouseEnter={shouldEnableOpenAll
							? showTooltip(HoverState.OpenAll)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<ArrowUpRight size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						disabled={!shouldEnableAddBookmark}
						onClick={() => dispatch(setPage(Page.AddBookmark))}
						onMouseEnter={shouldEnableAddBookmark
							? showTooltip(HoverState.Add)
							: undefined
						}
						onMouseLeave={hideTooltip}
					>
						<Plus size={idealFeatherIconSize} />
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

