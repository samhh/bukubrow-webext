/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { action } from "typesafe-actions"
import { UserActionTypes, Theme, Page } from "./types"
import { HostVersionCheckResult } from "~/modules/comms/native"

export const hostCheckResult = (comms: HostVersionCheckResult) =>
  action(UserActionTypes.HostCheckResult, comms)

export const setActiveTheme = (theme: Theme) =>
  action(UserActionTypes.SetActiveTheme, theme)

export const setNormalizeTags = (value: boolean) =>
  action(UserActionTypes.SetNormalizeTags, value)

export const setDisplayOpenAllBookmarksConfirmation = (display: boolean) =>
  action(UserActionTypes.SetDisplayOpenAllBookmarksConfirmation, display)

export const setPage = (page: Page) => action(UserActionTypes.SetPage, page)
