import styled from 'Styles';
import { ActiveTabMatch } from 'Comms/shared';
import { colors } from 'Modules/badge';

export enum BadgeWeight {
	Primary,
	Secondary,
	None,
}

export const mapActiveTabMatchToBadgeWeight = (activeTabMatch: ActiveTabMatch): BadgeWeight => {
	switch (activeTabMatch) {
		case ActiveTabMatch.Exact: return BadgeWeight.Primary;
		case ActiveTabMatch.Domain: return BadgeWeight.Secondary;
		default: return BadgeWeight.None;
	}
};

interface Props {
	weight: BadgeWeight;
}

const size = '8px';

const Badge = styled.span<Props>`
	width: ${size};
	height: ${size};
	display: inline-block;
	vertical-align: middle
	border-radius: 50%;
	background: ${(props) => {
		switch (props.weight) {
			case BadgeWeight.Primary: return colors[ActiveTabMatch.Exact];
			case BadgeWeight.Secondary: return colors[ActiveTabMatch.Domain];
			case BadgeWeight.None: return 'transparent';
		}
	}};
`;

export default Badge;
