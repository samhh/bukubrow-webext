import React, { FC } from 'react';
import styled from 'Styles';

const Wrapper = styled.div`
	padding: 1rem;
	text-align: center;
`;

const TutorialMessage: FC = () => (
	<Wrapper>
		<p>To fetch your bookmarks for use in Bukubrow click the button with the arrow in it above.</p>
		<p>Do this whenever you want to refresh your local cache of bookmarks with those from Buku.</p>
	</Wrapper>
);

export default TutorialMessage;
