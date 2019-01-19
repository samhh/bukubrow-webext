import React, { forwardRef, Ref, SFC, MouseEvent } from 'react';
import cn from 'classnames';
import styles from './button.css';

interface BaseProps {
	forwardedRef?: Ref<HTMLButtonElement>;
	onClick?(evt: MouseEvent<HTMLButtonElement>): void;
	tooltip?: string;
	type?: 'button' | 'submit';
	className?: string;
	tooltipClassName?: string;
}

interface PropsWithLabel extends BaseProps {
	label: string;
}

interface PropsWithIcon extends BaseProps {
	iconHTML: string;
}

type Props = XOR<PropsWithLabel, PropsWithIcon>;

const Button: SFC<Props> = props => (
	<button
		className={cn(
			styles.btn,
			{ [styles['btn--icon']]: !!props.iconHTML },
			props.className,
		)}
		type={props.type || 'button'}
		onClick={props.onClick}
		ref={props.forwardedRef}
	>
		{props.label}

		{props.iconHTML && (
			<span
				className={styles.icon}
				dangerouslySetInnerHTML={{ __html: props.iconHTML }}
			/>
		)}

		{props.tooltip && (
			<span className={cn(styles.tooltip, props.tooltipClassName)}>{props.tooltip}</span>
		)}
	</button>
);

export default forwardRef((props: Props, ref?: Ref<HTMLButtonElement>) => (
	<Button forwardedRef={ref} {...props} />
));
