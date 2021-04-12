import { Newtype, prism } from "newtype-ts"
import * as S from "fp-ts-std/String"

export const isBookmarkletCode: Predicate<string> = S.startsWith("javascript:")

export type BookmarkletCode = Newtype<
  { readonly BookmarkletCode: unique symbol },
  string
>
export const {
  getOption: mkBookmarkletCode,
  reverseGet: unBookmarkletCode,
} = prism<BookmarkletCode>(isBookmarkletCode)
