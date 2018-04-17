import React, { forwardRef, SFC, RefObject } from 'react';
import cn from 'classnames';
import styles from './bookmark.css';

import Button from 'Components/button/';
import HighlightMarkup from 'Components/highlight-markup/';
import PencilIcon from 'Assets/pencil.svg';
import Tag from 'Components/tag/';

interface Props {
	id: LocalBookmark['id'];
	title: LocalBookmark['title'];
	url: LocalBookmark['url'];
	desc: LocalBookmark['desc'];
	tags: LocalBookmark['tags'];
	textFilter: string;
	isFocused: boolean;
	openBookmark(url: LocalBookmark['url']): void;
	onEdit(id: LocalBookmark['id']): void;
}

export type ForwardRefElementType = HTMLLIElement;

const Bookmark = forwardRef((props: Props, ref) => {
	return (
		<li
			className={cn(styles.bookmark, { [styles['bookmark--focused']]: props.isFocused })}
			onClick={() => { props.openBookmark(props.url); }} // tslint:disable-line jsx-no-lambda
			ref={ref as RefObject<ForwardRefElementType>}
		>
			<header>
				<h1 className={styles.name}>
					<HighlightMarkup str={props.title} match={props.textFilter} />
				</h1>

				<ul className={styles.tags}>
					&nbsp;{props.tags.map(tag => (
						<Tag
							key={tag}
							id={tag}
							label={<HighlightMarkup str={tag} match={props.textFilter} />}
						/>
					))}
				</ul>

				<Button
					// tslint:disable-next-line jsx-no-lambda
					onClick={(evt) => { evt.stopPropagation(); props.onEdit(props.id); }}
					type="button"
					iconHTML={PencilIcon}
					tooltip="Edit bookmark"
					className={styles.edit}
				/>
			</header>

			{props.desc && (
				<p className={styles.desc}>
					&#x3E; <HighlightMarkup str={props.desc} match={props.textFilter} />
				</p>
			)}

			<h2 className={styles.url}>
				<HighlightMarkup str={props.url} match={props.textFilter} />
			</h2>
		</li>
	);
});

export default Bookmark;
