import React, { PureComponent, forwardRef, Ref, FormEvent } from 'react';
import shortid from 'shortid';
import cn from 'classnames';
import styles from './text-input.css';

interface Props {
	value: string;
	onInput(value: string): void;
	forwardedRef?: Ref<HTMLInputElement>;
	label?: string;
	placeholder?: string;
	max?: number | false;
	required?: boolean;
	disabled?: boolean;
	autoComplete?: boolean;
	className?: string;
}

class TextInput extends PureComponent<Props> {
	static defaultProps: Partial<Props> = {
		label: '',
		placeholder: '',
		max: false,
		required: false,
		disabled: false,
		autoComplete: false,
		className: '',
	};

	uid = shortid();

	handleInput = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const { currentTarget: { value } } = evt;

		if (
			this.props.max && // Are we enforcing max length?
			this.props.value.length < value.length && // Effectively allow user to backspace
			value.length > this.props.max // Are we over the max limit?
		) return;

		this.props.onInput(value);
	}

	render() {
		const inputClasses = cn(
			styles.input,
			{ [styles['input--disabled']]: this.props.disabled },
			this.props.className,
		);

		return (
			<div className={styles.wrapper}>
				{(this.props.label || this.props.max) && (
					<header className={styles.header}>
						<label
							htmlFor={this.uid}
							className={styles.label}
						>
							{this.props.label} {this.props.required ? '(required)' : ''}
						</label>

						{this.props.max && (
							<span
								className={cn(styles.counter, {
									[styles['counter--alert']]: this.props.value.length > this.props.max,
								})}
							>
								{this.props.max - this.props.value.length}
							</span>
						)}
					</header>
				)}

				<input
					type="text"
					onChange={this.handleInput}
					value={this.props.value}
					placeholder={this.props.placeholder}
					autoComplete={this.props.autoComplete ? 'on' : 'off'}
					id={this.uid}
					className={inputClasses}
					ref={this.props.forwardedRef}
				/>
			</div>
		);
	}
}

export default forwardRef((props: Props, ref?: Ref<HTMLInputElement>) => (
	<TextInput forwardedRef={ref} {...props} />
));
