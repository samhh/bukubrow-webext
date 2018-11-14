import React, { PureComponent, forwardRef, Ref, MouseEvent } from 'react';
import cn from 'classnames';
import styles from './button.css';

interface BaseProps {
	forwardedRef?: Ref<ForwardRefElementType>;
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

export type ForwardRefElementType = HTMLButtonElement;

class Button extends PureComponent<Props> {
	static defaultProps: Partial<Props> = {
		tooltip: '',
		type: 'button',
		className: '',
		tooltipClassName: '',
	};

	render() {
		return (
			<button
				className={cn(
					styles.btn,
					{ [styles['btn--icon']]: !!this.props.iconHTML },
					this.props.className,
				)}
				type={this.props.type}
				onClick={this.props.onClick}
				ref={this.props.forwardedRef}
			>
				{this.props.label}

				{this.props.iconHTML && (
					<span
						className={styles.icon}
						dangerouslySetInnerHTML={{ __html: this.props.iconHTML }}
					/>
				)}

				{this.props.tooltip && (
					<span className={cn(styles.tooltip, this.props.tooltipClassName)}>{this.props.tooltip}</span>
				)}
			</button>
		);
	}
}

export default forwardRef((props: Props, ref) => (
	<Button forwardedRef={ref as Ref<ForwardRefElementType> | undefined} {...props} />
));
