import React, { memo, forwardRef, Ref, MouseEvent, useState } from 'react';
import { URLMatch } from 'Modules/compare-urls';
import { ParsedInputResult } from 'Modules/parse-search-input';
import styled from 'Styles';

import Badge, { mapURLMatchToBadgeWeight } from 'Components/badge';
import HighlightMarkup from 'Components/highlight-markup';
import IconButton, { idealFeatherIconSize } from 'Components/icon-button';
import ListItem from 'Components/list-item';
import Tag from 'Components/tag';
import Tooltip from 'Components/tooltip';

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
	color: ${props => props.theme.textColor};
`;

const Desc = styled.p`
	margin: .3rem 0;
	font-size: 1.1rem;
`;

const URL = styled.h2`
	margin: .3rem 0 0;
	font-size: 1rem;
	font-weight: normal;
	color: ${props => props.theme.textColorOffset};
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

	const handleClick = () => {
		props.openBookmark && props.openBookmark(props.id);
	};

	const handleEdit = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();

		props.onEdit(props.id);
	};

	const handleDelete = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();

		props.onDelete(props.id);
	};

	const showTooltip = (msg: string) => () => {
		setTooltipMessage(msg);
		setDisplayTooltip(true);
	};

	const hideTooltip = () => {
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
							label={() => (
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
						onMouseEnter={showTooltip('Edit bookmark')}
						onMouseLeave={hideTooltip}
					>
						<Edit size={idealFeatherIconSize} />
					</ControlButton>

					<ControlButton
						onClick={handleDelete}
						type="button"
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
