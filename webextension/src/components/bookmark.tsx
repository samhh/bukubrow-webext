import React, { forwardRef, SFC, RefObject } from 'react';
import cn from 'classnames';
import HighlightMarkup from './highlight-markup';

interface Props {
	title: string;
	url: string;
	desc: string;
	tags: string[];
	textFilter: string;
	isFocused: boolean;
	openBookmark(url: string): void;
}

export type ForwardRefElementType = HTMLLIElement;

const Bookmark = forwardRef((props: Props, ref) => {
	const renderedTags = props.tags.map(tag => (
			<li
				className="bookmarks__item-tag"
				key={tag}
			>
				#<HighlightMarkup str={tag} match={props.textFilter} />
			</li>
	));

	const renderedDesc = props.desc ? (
		<p className="bookmarks__item-desc">
			&#x3E; <HighlightMarkup str={props.desc} match={props.textFilter} />
		</p>
	) : null;

	const classes = cn('bookmarks__item', { 'bookmarks__item--focused': props.isFocused });

	return (
		<li
			className={classes}
			onClick={() => { props.openBookmark(props.url); }} // tslint:disable-line jsx-no-lambda
			ref={ref as RefObject<ForwardRefElementType>}
		>
			<header>
				<h1 className="bookmarks__item-name">
					<HighlightMarkup str={props.title} match={props.textFilter} />
				</h1>
				<ul className="bookmarks__item-tags">
					&nbsp;{renderedTags}
				</ul>
			</header>
			{renderedDesc}
			<h2 className="bookmarks__item-url">
				<HighlightMarkup str={props.url} match={props.textFilter} />
			</h2>
		</li>
	);
});

export default Bookmark;
