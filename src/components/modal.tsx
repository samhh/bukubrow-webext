import React, { FC } from 'react';
import styled from '~~/styles';

const Outer = styled.div`
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem;
`;

const Inner = styled.div`
	width: 100%;
	max-height: 100%;
	padding: 2rem 1rem;
	border: 1px solid ${(props): string => props.theme.backgroundColorOffset};
	overflow-y: scroll;
	box-shadow: 0px 0px 7px -4px #999;
	background: ${(props): string => props.theme.backgroundColor};
`;

interface Props {
	children: React.ReactNode;
}

const Modal: FC<Props> = ({ children }) => (
	<Outer>
		<Inner>
			{children}
		</Inner>
	</Outer>
);

export default Modal;

