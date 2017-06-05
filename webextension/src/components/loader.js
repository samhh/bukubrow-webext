import { h } from 'preact'

const loader = ({ shouldDisplayLoader, children }) => shouldDisplayLoader
	? <h1>LOADING...</h1>
	: <div>{children}</div>

export default loader
