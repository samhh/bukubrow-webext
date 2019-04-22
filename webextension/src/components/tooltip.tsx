import React, { FC } from 'react';
import styled from 'Styles';

const StyledTooltip = styled.span<{ visible: boolean }>`
	padding: .5rem 1rem;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	white-space: nowrap;
	border-radius: ${props => props.theme.borderRadius};
	visibility: ${props => props.visible ? 'visible' : 'hidden'};
	opacity: ${props => props.visible ? 1 : 0};
	font-size: 1.4rem;
	background: ${props => props.theme.backgroundColor};
	transition: opacity .3s;
`;

interface Props {
	message: string;
	visible: boolean;
	className?: string;
}

const Tooltip: FC<Props> = props => (
	<StyledTooltip
		visible={props.visible}
		className={props.className}
	>
		{props.message}
	</StyledTooltip>
);

export default Tooltip;
