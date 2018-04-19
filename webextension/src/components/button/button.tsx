import React, { PureComponent, forwardRef, Ref, MouseEvent } from 'react';
import cn from 'classnames';
import styles from './button.css';

interface Props {
	forwardedRef?: Ref<ForwardRefElementType>;
	label?: string;
	iconHTML?: string;
	onClick?(evt: MouseEvent<HTMLButtonElement>): void;
	tooltip?: string;
	type?: 'button' | 'submit';
	className?: string;
	tooltipClassName?: string;
}

export type ForwardRefElementType = HTMLButtonElement;

class Button extends PureComponent<Props> {
	static defaultProps: Partial<Props> = {
		label: '',
		iconHTML: '',
		tooltip: '',
		type: 'button',
		className: '',
		tooltipClassName: '',
	};

	componentWillReceiveProps(nextProps: Props): void | never {
		if (!nextProps.label && !nextProps.iconHTML) {
			throw new Error('Must supply either label or iconHTML prop to Button component.');
		}

		if (nextProps.label && nextProps.iconHTML) {
			throw new Error('Cannot supply both label or iconHTML props to Button component.');
		}
	}

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
