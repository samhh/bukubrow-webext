import { browser, Omnibox } from "webextension-polyfill-ts"
import { runIO, runTask } from "./fp"

export const onOmniboxInput = (
  f: (input: string) => Task<Array<Omnibox.SuggestResult>>,
): IO<void> => () =>
  browser.omnibox.onInputChanged.addListener(
    (x, g) => void runTask(f(x)).then(g),
  )

export const onOmniboxSubmit = (
  f: (href: string) => (d: Omnibox.OnInputEnteredDisposition) => IO<void>,
): IO<void> => () =>
  browser.omnibox.onInputEntered.addListener((x, y) => runIO(f(x)(y)))
