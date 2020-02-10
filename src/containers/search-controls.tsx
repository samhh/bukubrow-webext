import React, { useRef, useEffect, useState, FC } from 'react';
import { useDispatch, useSelector } from '~/store';
import * as A from 'fp-ts/lib/Array';
import * as R from 'fp-ts/lib/Record';
import { setSearchFilterWithResets } from '~/store/epics';
import { getUnlimitedFilteredBookmarks } from '~/store/selectors';
import { setDisplayOpenAllBookmarksConfirmation, setPage } from '~/store/user/actions';
import { Page } from '~/store/user/types';
import { scrollToTop } from '~/modules/scroll-window';
import { matchesTerminology } from '~/modules/terminology';
import useListenToKeydown from '~/hooks/listen-to-keydown';
import styled from '~/styles';
import IconButton, { iconButtonSize, idealFeatherIconSize } from '~/components/icon-button';
import TextInput from '~/components/text-input';
import Tooltip from '~/components/tooltip';
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
	background: ${(props): string => props.theme.backgroundColor};
`;

const SearchTextInput = styled(TextInput)`
	height: ${iconButtonSize}px;
	padding: 0 ${headerItemsMargin};
	color: ${(props): string => props.theme.textColor};
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
	const stagedGroups = useSelector(state => state.bookmarks.stagedBookmarksGroups);
	const filteredBookmarks = useSelector(getUnlimitedFilteredBookmarks);
	const textFilter = useSelector(state => state.input.searchFilter);
	const dispatch = useDispatch();

	const numFilteredBookmarks = R.size(filteredBookmarks);
	const shouldEnableSearch = !R.isEmpty(allBookmarks);
	const shouldEnableOpenStaged = hasBinaryComms && !A.isEmpty(stagedGroups);
	const shouldEnableOpenAll = !R.isEmpty(filteredBookmarks);
	const shouldEnableAddBookmark = hasBinaryComms;

	const inputRef = useRef<HTMLInputElement>(null);
	const [hoverState, setHoverState] = useState(HoverState.None);

	const focusInput = (): void => {
		if (shouldEnableSearch && inputRef.current) inputRef.current.focus();
	};
	useEffect(focusInput, [shouldEnableSearch]);

	useListenToKeydown((evt) => {
		if (evt.ctrlKey && evt.key === 'l') focusInput();
	});

	const showTooltip = (state: HoverState) => (): void => {
		setHoverState(state);
	};

	const hideTooltip = (): void => {
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
				onInput={(text): void => {
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
						onClick={(): void => void dispatch(setPage(Page.StagedGroupsList))}
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
						onClick={(): void => void dispatch(setDisplayOpenAllBookmarksConfirmation(true))}
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
						onClick={(): void => void dispatch(setPage(Page.AddBookmark))}
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

