import React, { memo, forwardRef, Ref, MouseEvent, useState } from 'react';
import { ParsedInputResult } from 'Modules/parse-search-input';
import styled, { css } from 'Styles';

import BinIcon from 'Assets/bin.svg';
import Button from 'Components/button';
import HighlightMarkup from 'Components/highlight-markup';
import PencilIcon from 'Assets/pencil.svg';
import Tag from 'Components/tag';
import Tooltip from './tooltip';

const ControlsWrapper = styled.div`
	display: flex;
	position: relative;
	opacity: 0;
	float: right;
`;

const Wrapper = styled.li<{ isFocused: boolean }>`
	padding: 1rem;
	border-top: 1px solid ${props => props.theme.backgroundColorOffset};
	cursor: pointer;

	&:last-child {
		border-bottom: 1px solid ${props => props.theme.backgroundColorOffset};
	}

	&:hover {
		background-color: ${props => props.theme.backgroundColorOffset};

		${ControlsWrapper} {
			opacity: 1;
		}
	}

	${props => props.isFocused && css`
		background-color: ${props => props.theme.backgroundColorOffset};
	`}
`;

const TagsList = styled.ul`
	display: inline;
	padding: 0;
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
	margin: 0;
	font-size: 1rem;
	font-weight: normal;
	color: ${props => props.theme.textColorOffset};
`;

const ControlButton = styled(Button)`
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
	parsedFilter: ParsedInputResult;
	isFocused: boolean;
	openBookmark(id: LocalBookmark['id']): void;
	onEdit(id: LocalBookmark['id']): void;
	onDelete(id: LocalBookmark['id']): void;
	forwardedRef?: Ref<HTMLElement>;
}

const Bookmark = memo<Props>((props) => {
	const [tooltipMessage, setTooltipMessage] = useState('');
	const [displayTooltip, setDisplayTooltip] = useState(false);

	const handleClick = () => {
		props.openBookmark(props.id);
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
			<header>
				<Name>
					<HighlightMarkup str={props.title} match={[props.parsedFilter.name, ...props.parsedFilter.wildcard]} />
					&nbsp;
				</Name>

				<TagsList>
					{props.tags.map(tag => (
						<Tag
							key={tag}
							id={tag}
							label={() => <HighlightMarkup str={tag} match={[...props.parsedFilter.tags, ...props.parsedFilter.wildcard]} />}
						/>
					))}
				</TagsList>

				<ControlsWrapper>
					<div>
						<ControlButton
							onClick={handleEdit}
							type="button"
							iconHTML={PencilIcon}
							onMouseEnter={showTooltip('Edit bookmark')}
							onMouseLeave={hideTooltip}
						/>

						<ControlButton
							onClick={handleDelete}
							type="button"
							iconHTML={BinIcon}
							onMouseEnter={showTooltip('Delete bookmark')}
							onMouseLeave={hideTooltip}
						/>
					</div>

					<ControlButtonTooltip
						message={tooltipMessage}
						visible={displayTooltip}
					/>
				</ControlsWrapper>
			</header>

			{props.desc && (
				<Desc>
					&#x3E; <HighlightMarkup str={props.desc} match={[...props.parsedFilter.desc, ...props.parsedFilter.wildcard]} />
				</Desc>
			)}

			<URL>
				<HighlightMarkup str={props.url} match={[...props.parsedFilter.url, ...props.parsedFilter.wildcard]} />
			</URL>
		</Wrapper>
	);
});

export default forwardRef((props: Props, ref?: Ref<HTMLElement>) => (
	<Bookmark forwardedRef={ref} {...props} />
));
