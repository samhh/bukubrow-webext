import React, { FC } from 'react';
import styled from 'Styles';

const Wrapper = styled.p`
	text-align: center;
	font-size: 1.2rem;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`;

interface Props {
	numRemainingBookmarks: number;
	renderAllBookmarks(renderAll: boolean): void;
}

const LoadMoreBookmarks: FC<Props> = ({ numRemainingBookmarks, renderAllBookmarks }) => (
	<Wrapper onClick={(): void => renderAllBookmarks(true)}>
		...and {numRemainingBookmarks} more.
	</Wrapper>
);

export default LoadMoreBookmarks;

