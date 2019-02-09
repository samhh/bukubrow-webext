import React from 'react';
import cn from 'classnames';
import styles from './tag.css';

interface Props {
	id: string;
	label: string | React.ReactNode;
	onRemove?(tag: string): void;
}

const Tag: Comp<Props> = (props) => {
	const handleRemove = () => {
		if (props.onRemove) props.onRemove(props.id);
	};

	return (
		<li
			className={cn(styles.tag, { [styles['tag--removable']]: !!props.onRemove })}
			onClick={handleRemove}
		>
			#{props.label}
		</li>
	);
};

export default Tag;
