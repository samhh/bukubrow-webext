import React, { FC } from 'react';
import { ArrowLeft } from 'react-feather';
import styled from '~/styles';

const height = 40;
const padding = 5;
const border = 1;

const Wrapper = styled.nav`
	height: ${height}px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 0 ${border}px;
	padding: ${padding}px;

	&::after {
		content: '';
		width: 100%;
		height: ${border}px;
		position: absolute;
		top: 100%;
		left: 0;
		background: linear-gradient(90deg, transparent 5%, ${(props): string => props.theme.textColor} 50%, transparent 95%);
	}
`;

const IconWrapper = styled.span`
	position: absolute;
	top: 50%;
	left: ${padding}px;
	transform: translateY(-50%);
	cursor: pointer;
`;

const Header = styled.header`
	font-weight: bold;
`;

interface Props {
	title: string;
	onBack(): void;
}

const TitleMenu: FC<Props> = props => (
	<Wrapper>
		<IconWrapper onClick={props.onBack}>
			<ArrowLeft size={height - (padding * 4)} />
		</IconWrapper>

		<Header>{props.title}</Header>
	</Wrapper>
);

export default TitleMenu;

