import React, { forwardRef, Ref, SFC, FormEvent } from 'react';
import cn from 'classnames';
import s from './text-input.css';

interface Props {
	value: string;
	onInput(value: string): void;
	forwardedRef?: Ref<HTMLInputElement>;
	label?: string;
	placeholder?: string;
	max?: number;
	required?: boolean;
	disabled?: boolean;
	autoComplete?: boolean;
	className?: string;
}

const TextInput: SFC<Props> = (props) => {
	const handleInput = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { currentTarget: { value } } = evt;

		if (
			props.max && // Are we enforcing max length?
			props.value.length < value.length && // Effectively allow user to backspace
			value.length > props.max // Are we over the max limit?
		) return;

		props.onInput(value);
	};

	const inputClasses = cn(
		s.input,
		{ [s['input--disabled']]: props.disabled },
		props.className,
	);

	return (
		<div className={s.wrapper}>
			{(props.label || props.max) && (
				<header className={s.header}>
					<label className={s.label}>
						{props.label} {props.required ? '(required)' : ''}
					</label>

					{props.max && (
						<span
							className={cn(s.counter, {
								[s['counter--alert']]: props.value.length > props.max,
							})}
						>
							{props.max - props.value.length}
						</span>
					)}
				</header>
			)}

			<input
				type="text"
				onChange={handleInput}
				value={props.value}
				placeholder={props.placeholder}
				autoComplete={props.autoComplete ? 'on' : 'off'}
				className={inputClasses}
				ref={props.forwardedRef}
			/>
		</div>
	);
};

export default forwardRef((props: Props, ref?: Ref<HTMLInputElement>) => (
	<TextInput forwardedRef={ref} {...props} />
));
