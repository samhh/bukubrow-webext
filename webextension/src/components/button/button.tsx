import React, { forwardRef, Ref, SFC, MouseEvent } from 'react';
import cn from 'classnames';
import s from './button.css';

interface BaseProps {
	forwardedRef?: Ref<HTMLButtonElement>;
	onClick?(evt: MouseEvent<HTMLButtonElement>): void;
	tooltip?: string;
	type?: 'button' | 'submit';
	className?: string;
	wrapperClassName?: string;
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
	<span className={[s.wrapper, props.wrapperClassName].join(' ')}>
		<button
			className={cn(
				s.btn,
				{ [s['btn--icon']]: !!props.iconHTML },
				props.className,
			)}
			type={props.type || 'button'}
			onClick={props.onClick}
			ref={props.forwardedRef}
		>
			{props.label}

			{props.iconHTML && (
				<span
					className={s.icon}
					dangerouslySetInnerHTML={{ __html: props.iconHTML }}
				/>
			)}
		</button>

		{props.tooltip && (
			<span className={cn(s.tooltip, props.tooltipClassName)}>{props.tooltip}</span>
		)}
	</span>
);

export default forwardRef((props: Props, ref?: Ref<HTMLButtonElement>) => (
	<Button forwardedRef={ref} {...props} />
));
