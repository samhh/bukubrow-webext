import React from 'react';
import s from './highlight-markup.css';
import Highlighter from 'react-highlight-words';

interface Props {
	str: string;
	match: string[];
}

const HighlightMarkup: Comp<Props> = props => (
	<Highlighter
		highlightClassName={s.highlight}
		searchWords={props.match}
		textToHighlight={props.str}
	/>
);

export default HighlightMarkup;
