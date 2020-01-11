import React, { memo, forwardRef, Ref, MouseEvent, useState, ReactNode } from 'react';
import { URLMatch } from '~/modules/compare-urls';
import { ParsedInputResult } from '~/modules/parse-search-input';
import { LocalBookmark } from '~/modules/bookmarks';
import styled from '~/styles';

import Badge, { mapURLMatchToBadgeWeight } from '~/components/badge';
import HighlightMarkup from '~/components/highlight-markup';
import IconButton, { idealFeatherIconSize } from '~/components/icon-button';
import ListItem from '~/components/list-item';
import Tag from '~/components/tag';
import Tooltip from '~/components/tooltip';

import { Edit, Trash } from 'react-feather';

const ControlsWrapper = styled.div`
	display: flex;
	position: relative;
	white-space: nowrap;
	align-self: flex-start;
	opacity: 0;
	margin: 0 0 0 1rem;
`;

const Wrapper = styled(ListItem)`
	display: flex;
	justify-content: space-between;

	&:hover ${ControlsWrapper} {
		opacity: 1;
	}
`;

const TagsList = styled.ul`
	display: inline;
	padding: 0;
`;

const SpacedBadge = styled(Badge)`
	margin: 0 5px 0 0;
`;

const Name = styled.h1`
	display: inline-block;
	margin: 0;
	font-size: 1.4rem;
	font-weight: normal;
	color: ${(props): string => props.theme.textColor};
`;

const Desc = styled.p`
	margin: .3rem 0;
	font-size: 1.1rem;
`;

const URL = styled.h2`
	margin: .3rem 0 0;
	font-size: 1rem;
	font-weight: normal;
	color: ${(props): string => props.theme.textColorOffset};
`;

const ControlButton = styled(IconButton)`
	&:not(:last-child) {
		margin-right: .5rem;
	}
`;

const ControlButtonTooltip = styled(Tooltip)`
	position: absolute;
	top: 50%;
	right: calc(100% + .5rem);
	transform: translateY(-50%);
`;

interface Props {
	id: LocalBookmark['id'];
	title: LocalBookmark['title'];
	url: LocalBookmark['url'];
	desc: LocalBookmark['desc'];
	tags: LocalBookmark['tags'];
	activeTabURLMatch: URLMatch;
	onEdit(id: LocalBookmark['id']): void;
	onDelete(id: LocalBookmark['id']): void;
	openBookmark?(id: LocalBookmark['id']): void;
	isFocused?: boolean;
	parsedFilter?: ParsedInputResult;
	forwardedRef?: Ref<HTMLElement>;
}

const Bookmark = memo<Props>((props) => {
	const [tooltipMessage, setTooltipMessage] = useState('');
	const [displayTooltip, setDisplayTooltip] = useState(false);

	const handleClick = (): void => {
		props.openBookmark && props.openBookmark(props.id);
	};

	const handleEdit = (evt: MouseEvent<HTMLButtonElement>): void => {
		evt.stopPropagation();

		props.onEdit(props.id);
	};

	const handleDelete = (evt: MouseEvent<HTMLButtonElement>): void => {
		evt.stopPropagation();

		props.onDelete(props.id);
	};

	const showTooltip = (msg: string) => (): void => {
		setTooltipMessage(msg);
		setDisplayTooltip(true);
	};

	const hideTooltip = (): void => {
		setDisplayTooltip(false);
	};

	return (
		<Wrapper
			isFocused={props.isFocused}
			onClick={handleClick}
			ref={props.forwardedRef as Ref<HTMLLIElement>}
		>
			<div>
				<header>
					<Name>
						{props.activeTabURLMatch !== URLMatch.None && (
							<SpacedBadge weight={mapURLMatchToBadgeWeight(props.activeTabURLMatch)} />
						)}
						<HighlightMarkup
							str={props.title}
							match={props.parsedFilter && [props.parsedFilter.name, ...props.parsedFilter.wildcard]}
						/>
						&nbsp;
					</Name>
				</header>

				<TagsList>
					{props.tags.map(tag => (
						<Tag
							key={tag}
							id={tag}
							label={(): ReactNode => (
								<HighlightMarkup
									str={tag}
									match={props.parsedFilter && [...props.parsedFilter.tags, ...props.parsedFilter.wildcard]}
								/>
							)}
						/>
					))}
				</TagsList>

				{props.desc && (
					<Desc>
						&#x3E;
						&nbsp;
						<HighlightMarkup
							str={props.desc}
							match={props.parsedFilter && [...props.parsedFilter.desc, ...props.parsedFilter.wildcard]}
						/>
					</Desc>
				)}

				<URL>
					<HighlightMarkup
						str={props.url}
						match={props.parsedFilter && [...props.parsedFilter.url, ...props.parsedFilter.wildcard]}
					/>
				</URL>
			</div>

			<ControlsWrapper>
				<div>
					<ControlButton
						onClick={handleEdit}
						type="button"
						tabIndex={-1}
						onMouseEnter={showTooltip('Edit bookmark')}
						onMouseLeave={hideTooltip}
					>
						<Edit size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						onClick={handleDelete}
						type="button"
						tabIndex={-1}
						onMouseEnter={showTooltip('Delete bookmark')}
						onMouseLeave={hideTooltip}
					>
						<Trash size={idealFeatherIconSize} />
					</ControlButton>
				</div>

				<ControlButtonTooltip
					message={tooltipMessage}
					visible={displayTooltip}
				/>
			</ControlsWrapper>
		</Wrapper>
	);
});

export default forwardRef((props: Props, ref?: Ref<HTMLElement>) => (
	<Bookmark forwardedRef={ref} {...props} />
));

