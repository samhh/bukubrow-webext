/* eslint-disable @typescript-eslint/explicit-function-return-type */

import styled, { css } from '~~/styles';

const ListItem = styled.li<{ isFocused?: boolean }>`
	padding: 1rem;

  ${props => props.onClick && css`
    cursor: pointer;

    &:hover {
      background: ${(props): string => props.theme.backgroundColorOffset};
    }
  `}

	${props => props.isFocused && css`
		background: ${(props): string => props.theme.backgroundColorOffset};
  `}

  & + & {
    position: relative;
    margin-top: 1px;

    &::before {
      content: '';
      width: 100%;
      height: 1px;
      position: absolute;
      bottom: 100%;
      left: 0;
      background: ${(props): string => props.theme.backgroundColorOffset};
    }
  }
`;

export default ListItem;

