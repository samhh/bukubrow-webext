import React from 'react';
import styled, { css } from 'Styles';

const Wrapper = styled.div<{ visible: boolean }>`
	width: calc(100% - 2rem);
	position: fixed;
	z-index: 1;
	bottom: 1rem;
	left: 1rem;
	transform: translateY(calc(100% + 1rem));
	padding: 1rem;
	font-size: 1.4rem;
	border-radius: 2px;
	opacity: 0;
	background: #FFC0CB;
	color: #333;
	transition: all .25s;

	${props => props.visible && css`
		transform: translateY(0);
		opacity: 1;
	`}
`;

interface Props {
	msg: string;
}

const ErrorPopup: Comp<Props> = ({ msg }) => <Wrapper visible={!!msg}>{msg}</Wrapper>;

export default ErrorPopup;
