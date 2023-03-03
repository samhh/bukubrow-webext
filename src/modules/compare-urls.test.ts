import { URLMatch, match, ordURLMatch } from "~/modules/compare-urls"
import { ordNumber } from "fp-ts/lib/Ord"

describe("~/modules/compare-urls", () => {
  describe("match", () => {
    test("matches exact URL", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("https://samhh.com/")
      expect(match(url1)(url2)).toBe(URLMatch.Exact)
    })

    test("matches host and path if query differs", () => {
      const url1 = new URL("https://samhh.com/path?foo=bar#baz")
      const url2 = new URL("https://samhh.com/path?foo=baz#baz")
      expect(match(url1)(url2)).toBe(URLMatch.Path)
    })

    test("matches host and path if hash differs", () => {
      const url1 = new URL("https://samhh.com/path?foo=bar#baz")
      const url2 = new URL("https://samhh.com/path?foo=bar#bar")
      expect(match(url1)(url2)).toBe(URLMatch.Path)
    })

    test("matches host and path even if HTTP(S) protocol differs", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("http://samhh.com/")
      expect(match(url1)(url2)).toBe(URLMatch.Path)
    })

    test("matches domain", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("https://samhh.com/1/2/3")
      expect(match(url1)(url2)).toBe(URLMatch.Domain)
    })

    test("matches subdomain as domain", () => {
      const url1 = new URL("https://samhh.co.uk")
      const url2 = new URL("https://sub.domain.samhh.co.uk")
      expect(match(url1)(url2)).toBe(URLMatch.Domain)
    })

    test("does not match different domain", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("https://duckduckgo.com")
      expect(match(url1)(url2)).toBe(URLMatch.None)
    })

    test("does not match different TLD", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("https://samhh.co.uk")
      expect(match(url1)(url2)).toBe(URLMatch.None)
    })

    test("does not match URL if (non-HTTP(S)) protocols differ", () => {
      const url1 = new URL("https://samhh.com")
      const url2 = new URL("ftp://samhh.com/")
      expect(match(url1)(url2)).toBe(URLMatch.None)

      const url3 = new URL("ssh://samhh.com/")
      const url4 = new URL("ftp://samhh.com")
      expect(match(url3)(url4)).toBe(URLMatch.None)
    })
  })

  test("ordURLMatch", () => {
    expect(ordNumber.compare(10, 5)).toBe(1) // for reference
    expect(ordURLMatch.compare(URLMatch.Exact, URLMatch.Path)).toBe(1)
    expect(ordURLMatch.compare(URLMatch.Path, URLMatch.Domain)).toBe(1)
    expect(ordURLMatch.compare(URLMatch.Domain, URLMatch.None)).toBe(1)
    expect(ordURLMatch.compare(URLMatch.None, URLMatch.Exact)).toBe(-1)
  })
})
