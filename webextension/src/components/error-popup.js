import { h } from 'preact'
import classNames from 'classnames'

const errorPopup = ({ msg }) => {
	const classes = classNames('error-popup', { 'error-popup--visible': !!msg })

	return (
		<div className={classes}>
			{msg}
		</div>
	)
}

export default errorPopup
