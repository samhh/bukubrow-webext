import React from 'react';
import styled from 'Styles';
import Button from 'Components/button';
import Modal from 'Components/modal';

const Heading = styled.h1`
	margin: 0 0 1rem;
	font-size: 2rem;
`;

const ConfirmationButton = styled(Button)`
	margin: 0 0 0 .5rem;
`;

interface Props {
	onCancel(): void;
	onConfirm(): void;
	display: boolean;
	bookmark: LocalBookmark;
}

const BookmarkDeleteForm: Comp<Props> = props => (
	<>
		{props.display && (
			<Modal>
				<header>
					<Heading>Delete bookmark <em>{props.bookmark.title}</em>?</Heading>
				</header>

				<Button onClick={props.onCancel}>Cancel</Button>
				<ConfirmationButton onClick={props.onConfirm}>Delete</ConfirmationButton>
			</Modal>
		)}
	</>
);

export default BookmarkDeleteForm;
