import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import * as styledComponents from 'styled-components';
import styledSanitize from 'styled-sanitize';
import { Theme } from 'Modules/settings';

const {
	default: styled,
	css,
	createGlobalStyle,
	keyframes,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<StyledTheme>;

const GlobalStyles = createGlobalStyle`
	${styledSanitize}

	html {
		font-size: 62.5%;
	}

	body {
		max-width: 100%;
		width: 500px;
		min-height: 100vh;
		margin: 0;
		font-size: 1.6rem;
		font-family: sans-serif;
		background: ${props => props.theme.backgroundColor};
		color: ${props => props.theme.textColor};
	}
`;

interface StyledTheme {
	borderRadius: string;
	backgroundColor: string;
	backgroundColorOffset: string;
	backgroundColorOffsetOffset: string;
	textColor: string;
	textColorOffset: string;
}

const sharedTheme = {
	borderRadius: '3px',
	textColorOffset: '#888',
};

const lightTheme: StyledTheme = {
	...sharedTheme,
	backgroundColor: 'white',
	backgroundColorOffset: '#eee',
	backgroundColorOffsetOffset: '#ddd',
	textColor: '#282828',
};

const darkTheme: StyledTheme = {
	...sharedTheme,
	backgroundColor: '#282828',
	backgroundColorOffset: '#383838',
	backgroundColorOffsetOffset: '#484848',
	textColor: '#eee',
};

const mapStateToProps = (state: AppState) => ({ theme: state.user.activeTheme });
type Props = ReturnType<typeof mapStateToProps>;
const ThemeProvider: FC<Props> = props => (
	<styledComponents.ThemeProvider theme={() => {
		switch (props.theme) {
			case Theme.Light: return lightTheme;
			case Theme.Dark: return darkTheme;
		}
	}}>
		<>
			<GlobalStyles />

			{props.children}
		</>
	</styledComponents.ThemeProvider>
);
const ThemeProviderWithState = connect(mapStateToProps)(ThemeProvider);

export {
	ThemeProviderWithState,
	css,
	keyframes,
};

export default styled;
