import React, { SFC } from 'react';
import s from './highlight-markup.css';
import Highlighter from 'react-highlight-words';

interface Props {
	str: string;
	match: string[];
}

const HighlightMarkup: SFC<Props> = props => (
	<Highlighter
		highlightClassName={s.highlight}
		searchWords={props.match}
		textToHighlight={props.str}
	/>
);

export default HighlightMarkup;
