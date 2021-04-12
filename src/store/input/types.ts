import { Lens } from "monocle-ts"

export interface InputState {
  searchFilter: string
}

export const searchFilter = Lens.fromProp<InputState>()("searchFilter")

export enum InputActionTypes {
  SetSearchFilter = "SET_SEARCH_FILTER",
}
