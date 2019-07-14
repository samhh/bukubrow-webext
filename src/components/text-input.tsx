import React, { forwardRef, Ref, FormEvent, FC } from 'react';
import styled from 'Styles';

const Wrapper = styled.div`
	width: 100%;

	& + & {
		margin-top: 1rem;
	}
`;

const Header = styled.header`
	display: flex;
	justify-content: space-between;
`;

const Label = styled.label`
	margin: 0 0 .5rem;
`;

const Counter = styled.span<{ alerted: boolean }>`
	font-size: 1.3rem;
	font-weight: 900;
	color: ${props => props.alerted ? '#ec1d26' : '#989898'};
`;

const Input = styled.input`
	width: 100%;
	padding:.5rem 1rem;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	border-radius: ${props => props.theme.borderRadius};
	border-radius: 3px;
	background: none;
	color: ${props => props.theme.textColor};

	&::placeholder {
		color: '#9d9da3';
	}

	&:focus {
		outline: none;
		border-color: ${props => props.theme.backgroundColorOffsetOffset};
	}

	&:disabled {
		opacity: .25;
		font-style: italic;
	}
`;

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

const exceedsMaxLength = (newValue: string, max?: number) => typeof max === 'number' && newValue.length > max;
const isBackspacing = (oldValue: string, newValue: string) => oldValue.length > newValue.length;
const isInvalidInput = (oldValue: string, newValue: string, max?: number) =>
	exceedsMaxLength(newValue, max) &&
	!isBackspacing(oldValue, newValue);

const TextInput: FC<Props> = (props) => {
	const handleInput = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { currentTarget: { value } } = evt;

		if (isInvalidInput(props.value, value, props.max)) return;

		props.onInput(value);
	};

	const renderHeader = !!(props.label || props.max);

	return (
		<Wrapper>
			{renderHeader && (
				<Header>
					<Label>{props.label} {props.required ? '(required)' : ''}</Label>

					{props.max && (
						<Counter alerted={props.value.length > props.max}>
							{props.max - props.value.length}
						</Counter>
					)}
				</Header>
			)}

			<Input
				type="text"
				disabled={props.disabled}
				onChange={handleInput}
				value={props.value}
				placeholder={props.placeholder}
				autoComplete={props.autoComplete ? 'on' : 'off'}
				className={props.className}
				ref={props.forwardedRef}
			/>
		</Wrapper>
	);
};

export default forwardRef((props: Props, ref?: Ref<HTMLInputElement>) => (
	<TextInput forwardedRef={ref} {...props} />
));
