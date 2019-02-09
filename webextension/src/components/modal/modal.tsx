import React from 'react';
import styles from './modal.css';

interface Props {
	children: React.ReactNode;
}

const Modal: Comp<Props> = ({ children }) => (
	<div className={styles.wrapper}>
		<div className={styles.modal}>
			{children}
		</div>
	</div>
);

export default Modal;
