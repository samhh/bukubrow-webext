import { ReactNode } from 'react';
import styled from '~/styles';
import Button from '~/components/button';

interface Props {
	children: ReactNode;
}

export const iconButtonSize = 25;
export const idealFeatherIconSize = iconButtonSize - 10;

const IconButton = styled(Button)<Props>`
	width: ${iconButtonSize}px;
	height: ${iconButtonSize}px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 0;

	svg {
		/* Overriding Sanitize for Feather */
		fill: none !important;
	}
`;

export default IconButton;
