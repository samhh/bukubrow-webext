import * as t from "io-ts"
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable"
import { fromRefinement } from "io-ts-types/lib/fromRefinement"
import { Lens } from "monocle-ts"
import { pipe } from "fp-ts/lib/pipeable"
import { flow } from "fp-ts/lib/function"
import { eqString } from "fp-ts/lib/Eq"
import * as T from "fp-ts/lib/Task"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { elemC } from "~/modules/array"
import { values } from "fp-ts-std/Record"
import { decode } from "~/modules/io"
import { getSyncStorage, setSyncStorage } from "~/modules/sync"

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const isTheme: Refinement<string, Theme> = (arg): arg is Theme =>
  pipe(values(Theme), elemC(eqString)(arg))

const themeCodec = fromRefinement<Theme>(
  "theme",
  (x): x is Theme => t.string.is(x) && isTheme(x),
)

export enum BadgeDisplay {
  WithCount = "with_count",
  WithoutCount = "without_count",
  None = "none",
}

export const isBadgeDisplayOpt: Refinement<string, BadgeDisplay> = (
  arg,
): arg is BadgeDisplay => pipe(values(BadgeDisplay), elemC(eqString)(arg))

const badgeDisplayCodec = fromRefinement<BadgeDisplay>(
  "badgeDisplay",
  (x): x is BadgeDisplay => t.string.is(x) && isBadgeDisplayOpt(x),
)

export const isBool: Refinement<unknown, boolean> =
  (x): x is boolean => typeof x === 'boolean'

const normalizeTagsCodec = fromRefinement<boolean>("normalizeTags", isBool)

const settingsCodec = t.type({
  theme: optionFromNullable(themeCodec),
  badgeDisplay: optionFromNullable(badgeDisplayCodec),
  normalizeTags: optionFromNullable(normalizeTagsCodec),
})

export type Settings = t.TypeOf<typeof settingsCodec>
type SaveableSettings = Partial<UnwrapOptions<Settings>>

const saveableSettings = (x: Settings): SaveableSettings => ({
  theme: O.toUndefined(x.theme),
  badgeDisplay: O.toUndefined(x.badgeDisplay),
  normalizeTags: O.toUndefined(x.normalizeTags),
})

const theme = Lens.fromProp<Settings>()("theme")
const badgeDisplay = Lens.fromProp<Settings>()("badgeDisplay")
const normalizeTags = Lens.fromProp<Settings>()("normalizeTags")

export const saveSettings = flow(saveableSettings, setSyncStorage)

const getSettings: TaskEither<Error, Settings> = pipe(
  getSyncStorage(["theme", "badgeDisplay", "normalizeTags"]),
  T.map(E.chain(decode(settingsCodec))),
)

export const getActiveTheme: TaskEither<Error, Option<Theme>> = pipe(
  getSettings,
  T.map(E.map(flow(theme.get, O.chain(O.fromPredicate(isTheme))))),
)

export const getBadgeDisplayOpt: TaskEither<Error, Option<BadgeDisplay>> = pipe(
  getSettings,
  T.map(
    E.map(flow(badgeDisplay.get, O.chain(O.fromPredicate(isBadgeDisplayOpt)))),
  ),
)

export const getNormalizeTags: TaskEither<Error, Option<boolean>> = pipe(
  getSettings,
  T.map(
    E.map(flow(normalizeTags.get, O.chain(O.fromPredicate(isBool)))),
  ),
)
