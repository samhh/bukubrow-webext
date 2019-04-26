import React, { forwardRef, Ref, MouseEvent, ReactNode, FC } from 'react';
import styled from 'Styles';

const Btn = styled.button`
	padding: .5rem 1rem;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	border-radius: ${props => props.theme.borderRadius};
	font-size: 100%;
	opacity: ${props => props.disabled ? .25 : 1};
	background: ${props => props.theme.backgroundColorOffset};
	color: ${props => props.theme.textColor};
	user-select: none;
	transition: background-color .2s;

	/* Has to be !important to override Firefox default */
	&,
	&:focus {
		outline: none !important;
	}

	&:not(:disabled) {
		cursor: pointer;

		&:hover,
		&:focus {
			background-color: ${props => props.theme.backgroundColorOffsetOffset};
		}

		&:active {
			transform: translateY(2px);
		}
	}
`;

interface Props {
	children: ReactNode;
	forwardedRef?: Ref<HTMLButtonElement>;
	onClick?(evt: MouseEvent<HTMLButtonElement>): void;
	onMouseEnter?(evt: MouseEvent<HTMLButtonElement>): void;
	onMouseLeave?(evt: MouseEvent<HTMLButtonElement>): void;
	type?: 'button' | 'submit';
	disabled?: boolean;
	tabIndex?: number;
	className?: string;
}

const Button: FC<Props> = props => (
	<Btn
		type={props.type || 'button'}
		disabled={props.disabled}
		tabIndex={props.tabIndex}
		onClick={props.onClick}
		onMouseEnter={props.onMouseEnter}
		onMouseLeave={props.onMouseLeave}
		className={props.className}
		ref={props.forwardedRef}
	>
		{props.children}
	</Btn>
);

export default forwardRef((props: Props, ref?: Ref<HTMLButtonElement>) => (
	<Button forwardedRef={ref} {...props} />
));
