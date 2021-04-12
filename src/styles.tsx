import React, { FC } from "react"
import { useSelector } from "react-redux"
import { AppState } from "~/store"
import * as styledComponents from "styled-components"
import styledSanitize from "styled-sanitize"
import { Theme } from "~/modules/settings"

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
} = (styledComponents as unknown) as styledComponents.ThemedStyledComponentsModule<StyledTheme>

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
		background: ${(props): string => props.theme.backgroundColor};
		color: ${(props): string => props.theme.textColor};
	}
`

interface StyledTheme {
  borderRadius: string
  backgroundColor: string
  backgroundColorOffset: string
  backgroundColorOffsetOffset: string
  textColor: string
  textColorOffset: string
}

const sharedTheme = {
  borderRadius: "3px",
  textColorOffset: "#888",
}

const lightTheme: StyledTheme = {
  ...sharedTheme,
  backgroundColor: "white",
  backgroundColorOffset: "#eee",
  backgroundColorOffsetOffset: "#ddd",
  textColor: "#282828",
}

const darkTheme: StyledTheme = {
  ...sharedTheme,
  backgroundColor: "#282828",
  backgroundColorOffset: "#383838",
  backgroundColorOffsetOffset: "#484848",
  textColor: "#eee",
}

const ThemeProvider: FC = ({ children }) => {
  const theme = useSelector((state: AppState) => state.user.activeTheme)

  return (
    <styledComponents.ThemeProvider
      theme={(): StyledTheme => {
        switch (theme) {
          case Theme.Light:
            return lightTheme
          case Theme.Dark:
            return darkTheme
        }
      }}
    >
      <>
        <GlobalStyles />

        {children}
      </>
    </styledComponents.ThemeProvider>
  )
}

export { ThemeProvider, css, keyframes }

export default styled
