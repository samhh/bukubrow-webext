import React, { useState, useEffect, useRef, FormEvent, FC } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import styled from '~/styles';
import { LocalBookmark, LocalBookmarkUnsaved } from '~/modules/bookmarks';
import Button from '~/components/button';
import IconButton, { idealFeatherIconSize } from '~/components/icon-button';
import Tag from '~/components/tag';
import TextInput from '~/components/text-input';
import { Plus } from 'react-feather';

const Wrapper = styled.div`
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

const TagInputWrapper = styled.div`
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
	const setInputBookmarkPartial = (partialBookmark: Partial<BookmarkInput>): void => {
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

	const handleBookmarkTextInput = (key: KeyofStringValues<BookmarkInput>) => (input: string): void => {
		setInputBookmarkPartial({ [key]: input });
	};

	const handleTagAddition = (evt: FormEvent<HTMLFormElement>): void => {
		evt.preventDefault();
		evt.stopPropagation();

		const newTag = tagInput.trim();

		// Disallow adding an empty tag or the same tag twice
		if (!newTag || bookmarkInput.tags.includes(newTag)) return;

		setInputBookmarkPartial({ tags: [...bookmarkInput.tags, newTag] });
		setTagInput('');
	};

	const handleTagRemoval = (tagToRemove: string): void => {
		setInputBookmarkPartial({ tags: bookmarkInput.tags.filter(tag => tag !== tagToRemove) });
	};

	const handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
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
		<>
			<form id="main" onSubmit={handleSubmit} />
			<form id="tags" onSubmit={handleTagAddition} />

			<Wrapper>
				<Header>
					<Heading>
						{isEditing ? 'Edit bookmark' : 'Add a bookmark'}
					</Heading>
				</Header>

				<TextInput
					value={bookmarkInput.title}
					onInput={handleBookmarkTextInput('title')}
					form="main"
					label="Title"
					ref={firstInputRef}
				/>

				<TextInput
					value={bookmarkInput.desc}
					onInput={handleBookmarkTextInput('desc')}
					form="main"
					label="Description"
				/>

				<TextInput
					value={bookmarkInput.url}
					onInput={handleBookmarkTextInput('url')}
					form="main"
					label="URL"
				/>

				<TagInputWrapper>
					<TextInput
						value={tagInput}
						onInput={setTagInput}
						form="tags"
						label="Tags"
					/>

					<AddTagButton
						type="submit"
						form="tags"
						tabIndex={-1}
					>
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

				<SubmitButton type="submit" form="main">
					{isEditing ? 'Update bookmark' : 'Add bookmark'}
				</SubmitButton>
			</Wrapper>
		</>
	);
};

export default BookmarkForm;

