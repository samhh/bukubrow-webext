import React from 'react';
import Button from 'Components/button/';
import Modal from 'Components/modal/';
import s from './styles.css';

interface Props {
	onCancel(): void;
	onConfirm(): void;
	display: boolean;
	bookmark: LocalBookmark;
}

const BookmarkEditForm: Comp<Props> = props => props.display && (
	<Modal>
		<header>
			<h1 className={s['delete-heading']}>Delete bookmark <em>{props.bookmark.title}</em>?</h1>
		</header>

		<Button
			onClick={props.onCancel}
			label="Cancel"
		/>

		<Button
			onClick={props.onConfirm}
			label="Delete"
			className={s['delete-btn-confirm']}
		/>
	</Modal>
) || null;

export default BookmarkEditForm;
