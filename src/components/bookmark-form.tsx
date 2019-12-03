import React, { useState, useEffect, useRef, FormEvent, FC } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import styled from 'Styles';
import Button from 'Components/button';
import IconButton, { idealFeatherIconSize } from 'Components/icon-button';
import Tag from 'Components/tag';
import TextInput from 'Components/text-input';

import { Plus } from 'react-feather';

const Wrapper = styled.form`
	padding: 2rem 1rem;
`;

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

const TagInputWrapper = styled.form`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-gap: 1rem;
	margin: 1rem 0 0;
`;

const AddTagButton = styled(IconButton)`
	align-self: end;
	margin: 0 0 .5rem;
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
	onSubmit(bookmark: LocalBookmark | LocalBookmarkUnsaved): void;
	bookmark: Option<Partial<LocalBookmark>>;
}

interface BookmarkInput {
	id: Option<LocalBookmark['id']>;
	title: LocalBookmark['title'];
	desc: LocalBookmark['desc'];
	url: LocalBookmark['url'];
	tags: LocalBookmark['tags'];
}

type KeyofStringValues<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

const BookmarkForm: FC<Props> = (props) => {
	const firstInputRef = useRef<HTMLInputElement>(null);

	const [bookmarkInput, setBookmarkInput] = useState<BookmarkInput>({
		id: O.none,
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
		// Copy bookmark props into state
		if (O.isSome(props.bookmark)) {
			// Ensure not to copy unwanted properties into state
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { flags, id, ...toCopy } = props.bookmark.value;

			setInputBookmarkPartial({ ...toCopy, id: O.fromNullable(id) });
		}

		// Focus first input automatically
		if (firstInputRef.current) firstInputRef.current.focus();
	}, []);

	const handleBookmarkTextInput = (key: KeyofStringValues<BookmarkInput>) => (input: string) => {
		setInputBookmarkPartial({ [key]: input });
	};

	const handleTagAddition = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		evt.stopPropagation();

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
			id: O.toUndefined(bookmarkInput.id),
			flags: 0,
		};

		props.onSubmit(bookmark);
	};

	const isEditing = pipe(
		props.bookmark,
		O.chain(bm => O.fromNullable(bm.id)),
		O.isSome,
	);

	return (
		<Wrapper onSubmit={handleSubmit}>
			<Header>
				<Heading>
					{isEditing ? 'Edit bookmark' : 'Add a bookmark'}
				</Heading>
			</Header>

			<TextInput
				value={bookmarkInput.title}
				onInput={handleBookmarkTextInput('title')}
				label="Title"
				ref={firstInputRef}
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

			<TagInputWrapper onSubmit={handleTagAddition}>
				<TextInput
					value={tagInput}
					onInput={setTagInput}
					label="Tags"
				/>

				<AddTagButton type="submit" tabIndex={-1}>
					<Plus size={idealFeatherIconSize} />
				</AddTagButton>
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

			<SubmitButton type="submit">
				{isEditing ? 'Update bookmark' : 'Add bookmark'}
			</SubmitButton>
		</Wrapper>
	);
};

export default BookmarkForm;

