import React, { FC } from "react"
import Highlighter from "react-highlight-words"

const highlightedStyle = {
  background: "#ACCEA8",
  color: "#333",
}

interface Props {
  str: string
  match?: Array<string>
}

const HighlightMarkup: FC<Props> = props => (
  <Highlighter
    highlightStyle={highlightedStyle}
    searchWords={props.match || []}
    textToHighlight={props.str}
  />
)

export default HighlightMarkup
