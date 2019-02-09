import React, { useState, useEffect, FormEvent } from 'react';
import { Maybe, Nothing } from 'purify-ts/Maybe';
import styles from './bookmark-form.css';

import Button from 'Components/button/';
import Modal from 'Components/modal/';
import PlusIcon from 'Assets/plus.svg';
import Tag from 'Components/tag/';
import TextInput from 'Components/text-input/';

interface Props {
	onClose(): void;
	onSubmit(bookmark: LocalBookmark | LocalBookmarkUnsaved): void;
	bookmark: Maybe<Partial<LocalBookmark>>;
}

interface BookmarkInput {
	id: Maybe<LocalBookmark['id']>;
	title: LocalBookmark['title'];
	desc: LocalBookmark['desc'];
	url: LocalBookmark['url'];
	tags: LocalBookmark['tags'];
}

type KeyofStringValues<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

const BookmarkForm: Comp<Props> = (props) => {
	const [bookmarkInput, setBookmarkInput] = useState<BookmarkInput>({
		id: Nothing,
		title: '',
		desc: '',
		url: '',
		tags: [],
	});
	const setInputBookmarkPartial = (partialBookmark: Partial<BookmarkInput>) => {
		setBookmarkInput({ ...bookmarkInput, ...partialBookmark });
	};

	const [tagInput, setTagInput] = useState('');

	useEffect(() => {
		props.bookmark.ifJust((bookmark) => {
			// Ensure not to copy unwanted properties into state
			const { flags, id, ...toCopy } = bookmark;

			setInputBookmarkPartial({ ...toCopy, id: Maybe.fromNullable(id) });
		});
	}, []);

	const handleBookmarkTextInput = (key: KeyofStringValues<BookmarkInput>) => (input: string) => {
		setInputBookmarkPartial({ [key]: input });
	};

	const handleTagAddition = () => {
		const newTag = tagInput.trim();

		// Disallow adding an empty tag or the same tag twice
		if (!newTag || bookmarkInput.tags.includes(newTag)) return;

		setInputBookmarkPartial({ tags: [...bookmarkInput.tags, newTag] });
		setTagInput('');
	};

	const handleTagRemoval = (tagToRemove: string) => {
		setInputBookmarkPartial({ tags: bookmarkInput.tags.filter(tag => tag !== tagToRemove) });
	};

	const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();

		const bookmark = { ...bookmarkInput, flags: 0 };
		if (bookmark.id === null) delete bookmark.id;

		if (!bookmark.title || !bookmark.url) return;

		props.onSubmit(bookmark as LocalBookmark | LocalBookmarkUnsaved);
	};

	return (
		<Modal>
			<form onSubmit={handleSubmit}>
				<header className={styles.header}>
					<h1 className={styles.heading}>
						{props.bookmark && 'id' in props.bookmark
							? 'Edit bookmark'
							: 'Add a bookmark'
						}
					</h1>

					<Button
						iconHTML={PlusIcon}
						className={styles.exit}
						onClick={props.onClose}
					/>
				</header>

				<TextInput
					value={bookmarkInput.title}
					onInput={handleBookmarkTextInput('title')}
					label="Title"
				/>

				<TextInput
					value={bookmarkInput.desc}
					onInput={handleBookmarkTextInput('desc')}
					label="Description"
				/>

				<TextInput
					value={bookmarkInput.url}
					onInput={handleBookmarkTextInput('url')}
					label="URL"
				/>

				<div className={styles['tag-input-wrapper']}>
					<TextInput
						value={tagInput}
						onInput={setTagInput}
						label="Tags"
					/>

					<Button
						onClick={handleTagAddition}
						iconHTML={PlusIcon}
						className={styles['tag-btn']}
					/>
				</div>

				<ul className={styles.tags}>
					{bookmarkInput.tags.map(tag => (
						<Tag
							key={tag}
							id={tag}
							label={tag}
							onRemove={handleTagRemoval}
						/>
					))}
				</ul>

				<Button
					type="submit"
					label={props.bookmark && 'id' in props.bookmark
						? 'Update bookmark'
						: 'Add bookmark'
					}
					className={styles.btn}
				/>
			</form>
		</Modal>
	);
};

export default BookmarkForm;
