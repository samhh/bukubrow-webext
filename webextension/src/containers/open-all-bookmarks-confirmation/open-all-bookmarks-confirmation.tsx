import React from 'react';
import Button from 'Components/button/';
import Modal from 'Components/modal/';
import s from './styles.css';

interface Props {
	onCancel(): void;
	onConfirm(): void;
	display: boolean;
	numToOpen: number;
}

const OpenAllBookmarksConfirmation: Comp<Props> = props => props.display && (
	<Modal>
		<header>
			<h1 className={s['heading']}>Open all {props.numToOpen} bookmarks?</h1>
		</header>

		<Button
			onClick={props.onCancel}
			label="Cancel"
		/>

		<Button
			onClick={props.onConfirm}
			label="Open"
			className={s['btn-confirm']}
		/>
	</Modal>
) || null;

export default OpenAllBookmarksConfirmation;
