import { flow, not } from "fp-ts/lib/function"
import { ordNumber, contramap } from "fp-ts/lib/Ord"
import { eqString } from "fp-ts/lib/Eq"
import { equal, mapBoth } from "~/modules/tuple"
import * as A from "fp-ts/Array"
import { hostAndPath, isHttpOrHttps, domain } from "~/modules/url"

export enum URLMatch {
  Exact = "exact",
  Path = "path",
  Domain = "domain",
  None = "none",
}

const eqS = equal(eqString)
const eqUrl = flow(mapBoth(String), eqS)
const eqPath = flow(mapBoth(hostAndPath), eqS)
const eqDomain = flow(mapBoth(domain), eqS)

/**
 * Compare two URLs and determine similarity.
 */
export const match = (x: URL) => (y: URL): URLMatch => {
  const zs: [URL, URL] = [x, y]

  // Never match URLs with non-HTTP(S) protocols
  if (A.some(not(isHttpOrHttps))(zs)) return URLMatch.None

  // Match URLs as exact if they're exactly identical
  if (eqUrl(zs)) return URLMatch.Exact

  // Check equality of hostname and path (ignoring protocol(s))
  if (eqPath(zs)) return URLMatch.Path

  // Check equality of domain (ignoring subdomain(s))
  if (eqDomain(zs)) return URLMatch.Domain

  return URLMatch.None
}

export const ordURLMatch = contramap<number, URLMatch>(x => {
  switch (x) {
    case URLMatch.Exact:
      return 3
    case URLMatch.Path:
      return 2
    case URLMatch.Domain:
      return 1
    case URLMatch.None:
      return 0
  }
})(ordNumber)
