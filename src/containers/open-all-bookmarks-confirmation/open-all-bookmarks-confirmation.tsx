import React, { FC } from 'react';
import { matchesTerminology } from 'Modules/terminology';
import Button from 'Components/button';
import Modal from 'Components/modal';
import styled from 'Styles';

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
	numToOpen: number;
}

const OpenAllBookmarksConfirmation: FC<Props> = props => (
	<>
		{props.display && (
			<Modal>
				<header>
					<Heading>{matchesTerminology(props.numToOpen)}?</Heading>
				</header>

				<Button onClick={props.onCancel}>Cancel</Button>
				<ConfirmationButton onClick={props.onConfirm}>Open</ConfirmationButton>
			</Modal>
		)}
	</>
);

export default OpenAllBookmarksConfirmation;
