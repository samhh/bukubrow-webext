import React, { FC } from 'react';
import styled from '~/styles';

const StyledTooltip = styled.span<{ visible: boolean }>`
	padding: .5rem 1rem;
	border: 1px solid ${(props): string => props.theme.backgroundColorOffset};
	white-space: nowrap;
	border-radius: ${(props): string => props.theme.borderRadius};
	visibility: ${(props): string => props.visible ? 'visible' : 'hidden'};
	opacity: ${(props): number => props.visible ? 1 : 0};
	font-size: 1.4rem;
	background: ${(props): string => props.theme.backgroundColor};
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

