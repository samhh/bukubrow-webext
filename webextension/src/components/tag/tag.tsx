import React, { PureComponent } from 'react';
import cn from 'classnames';
import styles from './tag.css';

interface Props {
	id: string;
	label: string | React.ReactNode;
	onRemove?(tag: string): void;
}

class Tag extends PureComponent<Props> {
	handleRemove = () => {
		if (this.props.onRemove) this.props.onRemove(this.props.id);
	}

	render() {
		return (
			<li
				className={cn(styles.tag, { [styles['tag--removable']]: !!this.props.onRemove })}
				onClick={this.handleRemove}
			>
				#{this.props.label}
			</li>
		);
	}
}

export default Tag;
