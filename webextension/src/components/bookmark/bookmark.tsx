import React, { PureComponent, forwardRef, SFC, Ref, MouseEvent } from 'react';
import cn from 'classnames';
import styles from './bookmark.css';

import BinIcon from 'Assets/bin.svg';
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
	onDelete(id: LocalBookmark['id']): void;
	forwardedRef?: Ref<ForwardRefElementType>;
}

export type ForwardRefElementType = HTMLLIElement;

class Bookmark extends PureComponent<Props> {
	handleClick = () => {
		this.props.openBookmark(this.props.url);
	}

	handleEdit = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();

		this.props.onEdit(this.props.id);
	}

	handleDelete = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();

		this.props.onDelete(this.props.id);
	}

	render(): JSX.Element {
		return (
			<li
				className={cn(styles.bookmark, { [styles['bookmark--focused']]: this.props.isFocused })}
				onClick={this.handleClick}
				ref={this.props.forwardedRef}
			>
				<header>
					<h1 className={styles.name}>
						<HighlightMarkup str={this.props.title} match={this.props.textFilter} />
					</h1>

					<ul className={styles.tags}>
						&nbsp;{this.props.tags.map(tag => (
							<Tag
								key={tag}
								id={tag}
								label={<HighlightMarkup str={tag} match={this.props.textFilter} />}
							/>
						))}
					</ul>

					<div className={styles.controls}>
						<Button
							onClick={this.handleEdit}
							type="button"
							iconHTML={PencilIcon}
							tooltip="Edit bookmark"
							className={styles.edit}
							tooltipClassName={styles.tooltip}
						/>

						<Button
							onClick={this.handleDelete}
							type="button"
							iconHTML={BinIcon}
							tooltip="Delete bookmark"
							className={styles.delete}
							tooltipClassName={styles.tooltip}
						/>
					</div>
				</header>

				{this.props.desc && (
					<p className={styles.desc}>
						&#x3E; <HighlightMarkup str={this.props.desc} match={this.props.textFilter} />
					</p>
				)}

				<h2 className={styles.url}>
					<HighlightMarkup str={this.props.url} match={this.props.textFilter} />
				</h2>
			</li>
		);
	}
}

export default forwardRef((props: Props, ref) => (
	<Bookmark forwardedRef={ref as Ref<ForwardRefElementType> | undefined} {...props} />
));
