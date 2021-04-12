import { pipe } from "fp-ts/lib/pipeable"
import { flow } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
import * as A from "fp-ts/lib/Array"
import * as S from "fp-ts-std/String"
import { Lens } from "monocle-ts"
import { elemFlipped, join } from "fp-ts-std/Array"
import { eqString } from "fp-ts/lib/Eq"

export const fromString = (url: string): Either<DOMException, URL> =>
  E.tryCatch(
    () => new URL(url),
    err => (err instanceof DOMException ? err : new DOMException()),
  )

export const href = Lens.fromProp<URL>()("href")
export const protocol = Lens.fromProp<URL>()("protocol")
export const host = Lens.fromProp<URL>()("host")
export const hostname = Lens.fromProp<URL>()("hostname")
export const pathname = Lens.fromProp<URL>()("pathname")

/**
 * Get the domain/host without the subdomain.
 */
export const domain = (x: URL): string =>
  pipe(host.get(x), S.split("."), A.takeRight(2), join("."))

export const hrefSansProtocol = (x: URL): string =>
  host.get(x) + pathname.get(x)

export const isHttpOrHttps: Predicate<URL> = flow(
  protocol.get,
  elemFlipped(eqString)(["http:", "https:"]),
)
