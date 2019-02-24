import React, { useState, useEffect, FormEvent } from 'react';
import { Maybe, Nothing } from 'purify-ts/Maybe';
import styled from 'Styles';

import Button from 'Components/button';
import Modal from 'Components/modal';
import PlusIcon from 'Assets/plus.svg';
import Tag from 'Components/tag';
import TextInput from 'Components/text-input';

const Header = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 2rem;
`;

const Heading = styled.h1`
	display: inline-block;
	margin: 0;
	font-size: 2rem;
`;

const TagInputWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-gap: 1rem;
	margin: 1rem 0 0;
`;

const AddTagButton = styled(Button)`
	align-self: end;
	margin: 0 0 .5rem;
`;

const ExitButton = styled(Button)`
	svg {
		transform: rotate(45deg);
	}
`;

const SubmitButton = styled(Button)`
	margin: 2rem 0 0;
`;

const TagList = styled.ul`
	list-style: none;
	margin: .5rem 0 0;
	padding: 0;
`;

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
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

		if (!bookmarkInput.title || !bookmarkInput.url) return;

		const bookmark = {
			...bookmarkInput,
			id: bookmarkInput.id.extract(),
			flags: 0,
		};

		props.onSubmit(bookmark);
	};

	const isEditing = props.bookmark.chain(bm => Maybe.fromNullable(bm.id)).isJust();

	return (
		<Modal>
			<form onSubmit={handleSubmit}>
				<Header>
					<Heading>
						{isEditing ? 'Edit bookmark' : 'Add a bookmark'}
					</Heading>

					<ExitButton
						iconHTML={PlusIcon}
						onClick={props.onClose}
					/>
				</Header>

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

				<TagInputWrapper>
					<TextInput
						value={tagInput}
						onInput={setTagInput}
						label="Tags"
					/>

					<AddTagButton
						onClick={handleTagAddition}
						iconHTML={PlusIcon}
					/>
				</TagInputWrapper>

				<TagList>
					{bookmarkInput.tags.map(tag => (
						<Tag
							key={tag}
							id={tag}
							label={tag}
							onRemove={handleTagRemoval}
						/>
					))}
				</TagList>

				<SubmitButton
					type="submit"
					label={isEditing ? 'Update bookmark' : 'Add bookmark'}
				/>
			</form>
		</Modal>
	);
};

export default BookmarkForm;
