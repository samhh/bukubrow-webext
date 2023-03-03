import { Lens } from "monocle-ts"
import { AppState } from "~/store/"
import { HostVersionCheckResult } from "~/modules/comms/native"
import { Theme } from "~/modules/settings"
export { Theme }

export interface UserState {
  comms: HostVersionCheckResult
  activeTheme: Theme
  normalizeTags: boolean
  displayOpenAllBookmarksConfirmation: boolean
  page: Page
}

export const userL = Lens.fromProp<AppState>()("user")

export const comms = Lens.fromProp<UserState>()("comms")
export const activeTheme = Lens.fromProp<UserState>()("activeTheme")
export const normalizeTags = Lens.fromProp<UserState>()("normalizeTags")
export const displayOpenAllBookmarksConfirmation = Lens.fromProp<UserState>()(
  "displayOpenAllBookmarksConfirmation",
)
export const page = Lens.fromProp<UserState>()("page")

export const commsL = userL.compose(comms)

export enum UserActionTypes {
  HostCheckResult = "HOST_CHECK_RESULT",
  SetActiveTheme = "SET_ACTIVE_THEME",
  SetNormalizeTags = "SET_NORMALIZE_TAGS",
  SetDisplayOpenAllBookmarksConfirmation = "SET_OPEN_ALL_BOOKMARKS_CONFIRMATION",
  SetPage = "SET_PAGE",
}

export enum Page {
  Search,
  AddBookmark,
  EditBookmark,
  StagedGroupsList,
  StagedGroup,
  EditStagedBookmark,
}
