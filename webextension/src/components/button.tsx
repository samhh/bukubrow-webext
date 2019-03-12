import React, { forwardRef, Ref, MouseEvent } from 'react';
import styled, { css } from 'Styles';

export const buttonIconSize = '25px';

const Btn = styled.button<{ asIcon: boolean }>`
	padding: .5rem 1rem;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	border-radius: ${props => props.theme.borderRadius};
	font-size: 100%;
	opacity: ${props => props.disabled ? .25 : 1};
	background: ${props => props.theme.backgroundColorOffset};
	color: ${props => props.theme.textColor};
	user-select: none;
	transition: background-color .2s;

	${props => props.asIcon && css`
		width: ${buttonIconSize};
		height: ${buttonIconSize};
		padding: .5rem;
	`}

	/* Has to be !important to override Firefox default */
	&,
	&:focus {
		outline: none !important;
	}

	&:not(:disabled) {
		cursor: pointer;

		&:hover {
			background-color: ${props => props.theme.backgroundColorOffsetOffset};
		}

		&:active {
			transform: translateY(2px);
		}
	}
`;

const Icon = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;

	svg {
		width: 100%;
		fill: ${props => props.theme.textColor};
	}
`;

interface Props {
	forwardedRef?: Ref<HTMLButtonElement>;
	onClick?(evt: MouseEvent<HTMLButtonElement>): void;
	onMouseEnter?(evt: MouseEvent<HTMLButtonElement>): void;
	onMouseLeave?(evt: MouseEvent<HTMLButtonElement>): void;
	label?: string;
	iconHTML?: string;
	type?: 'button' | 'submit';
	disabled?: boolean;
	className?: string;
}

const Button: Comp<Props> = props => (
	<Btn
		asIcon={!!props.iconHTML}
		type={props.type || 'button'}
		disabled={props.disabled}
		onClick={props.onClick}
		onMouseEnter={props.onMouseEnter}
		onMouseLeave={props.onMouseLeave}
		className={props.className}
		ref={props.forwardedRef}
	>
		{props.label}

		{props.iconHTML && (
			<Icon dangerouslySetInnerHTML={{ __html: props.iconHTML }} />
		)}
	</Btn>
);

export default forwardRef((props: Props, ref?: Ref<HTMLButtonElement>) => (
	<Button forwardedRef={ref} {...props} />
));
