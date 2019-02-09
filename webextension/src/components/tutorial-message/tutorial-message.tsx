import React from 'react';
import s from './tutorial-message.css';

const TutorialMessage: Comp = () => (
	<div className={s.wrapper}>
		<p>To fetch your bookmarks for use in Bukubrow click the button with the arrow in it above.</p>
		<p>Do this whenever you want to refresh your local cache of bookmarks with those from Buku.</p>
	</div>
);

export default TutorialMessage;
