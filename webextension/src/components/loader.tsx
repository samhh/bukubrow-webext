import React, { SFC } from 'react';

interface Props {
	shouldDisplayLoader: boolean;
	children: JSX.Element | JSX.Element[];
}

const Loader: SFC<Props> = ({ shouldDisplayLoader, children }) => shouldDisplayLoader
	? <h1>LOADING...</h1>
	: <div>{children}</div>;

export default Loader;
