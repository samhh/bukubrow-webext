import React from 'react';
import styles from './tutorial-message.css';

const TutorialMessage: Comp = () => (
	<p className={styles.msg}>
		To fetch your bookmarks for use in Bukubrow click the button with the arrow in it above.
		<br />
		Do this whenever you want to refresh your local cache of bookmarks with those from Buku.
	</p>
);

export default TutorialMessage;
