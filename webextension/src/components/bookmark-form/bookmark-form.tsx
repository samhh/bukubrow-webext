import React, { Component, FormEvent } from 'react';
import styles from './bookmark-form.css';

import Button from 'Components/button/';
import Modal from 'Components/modal/';
import PlusIcon from 'Assets/plus.svg';
import Tag from 'Components/tag/';
import TextInput from 'Components/text-input/';

interface Props {
	onClose(): void;
	onSubmit(bookmark: LocalBookmark | LocalBookmarkUnsaved): void;
	bookmark?: Partial<LocalBookmark>;
}

interface State extends LocalBookmark {
	tagInput: string;
}

class BookmarkForm extends Component<Props, State> {
	// This cannot match any preexisting bookmark, and will be discarded prior to
	// submission
	static fauxId = -1;

	state = {
		id: BookmarkForm.fauxId,
		title: '',
		desc: '',
		url: '',
		tags: [] as LocalBookmark['tags'],
		flags: 0,
		tagInput: '',
	};

	componentDidMount(): void {
		// Type assertion as setState type seems imperfect here
		if (this.props.bookmark) this.setState({ ...this.props.bookmark as State });
	}

	handleClose = (): void => {
		this.props.onClose();
	}

	handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
		evt.preventDefault();

		const bookmark = { ...this.state };
		delete bookmark.tagInput;
		if (bookmark.id === BookmarkForm.fauxId) delete bookmark.id;

		if (!bookmark.title || !bookmark.url) return;

		this.props.onSubmit(bookmark as LocalBookmark | LocalBookmarkUnsaved);
	}

	handleFormTitle = (title: string): void => {
		this.setState({ title });
	}

	handleFormDesc = (desc: string): void => {
		this.setState({ desc });
	}

	handleFormUrl = (url: string): void => {
		this.setState({ url });
	}

	handleTagInput = (tagInput: string): void => {
		this.setState({ tagInput });
	}

	handleTagAddition = (): void => {
		// Strip whitespace from either end
		const tagToAdd = this.state.tagInput.trim();

		// Disallow adding an empty tag or the same tag twice
		if (!tagToAdd || this.state.tags.includes(tagToAdd)) return;

		this.setState({
			tags: [...this.state.tags, tagToAdd],
			tagInput: '',
		});
	}

	handleTagRemoval = (tagToRemove: string): void => {
		this.setState({ tags: this.state.tags.filter(tag => tag !== tagToRemove) });
	}

	render() {
		return (
			<Modal>
				<form onSubmit={this.handleSubmit}>
					<header className={styles.header}>
						<h1 className={styles.heading}>
							{this.props.bookmark && 'id' in this.props.bookmark
								? 'Edit bookmark'
								: 'Add a bookmark'
							}
						</h1>

						<Button
							iconHTML={PlusIcon}
							className={styles.exit}
							onClick={this.handleClose}
						/>
					</header>

					<TextInput
						value={this.state.title}
						onInput={this.handleFormTitle}
						label="Title"
					/>

					<TextInput
						value={this.state.desc}
						onInput={this.handleFormDesc}
						label="Description"
					/>

					<TextInput
						value={this.state.url}
						onInput={this.handleFormUrl}
						label="URL"
					/>

					<div className={styles['tag-input-wrapper']}>
						<TextInput
							value={this.state.tagInput}
							onInput={this.handleTagInput}
							label="Tags"
						/>

						<Button
							onClick={this.handleTagAddition}
							iconHTML={PlusIcon}
							className={styles['tag-btn']}
						/>
					</div>

					<ul className={styles.tags}>
						{this.state.tags.map(tag => (
							<Tag
								key={tag}
								id={tag}
								label={tag}
								onRemove={this.handleTagRemoval}
							/>
						))}
					</ul>

					<Button
						type="submit"
						label={this.props.bookmark && 'id' in this.props.bookmark
							? 'Update bookmark'
							: 'Add bookmark'
						}
						className={styles.btn}
					/>
				</form>
			</Modal>
		);
	}
}

export default BookmarkForm;
