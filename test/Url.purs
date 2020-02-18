module Test.App.Url where

import Prelude

import App.Url (UrlMatch(..), Url, domainFromHost, hrefSansProtocol, httpFromProtocol, mkUrl, mkUrlImpl)
import App.Url as URL
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Foreign (unsafeFromForeign)
import Test.Assert (assert, assertEqual)
import Test.Utils (assertEQ, assertGT, assertLT)

mkUrlUnsafe :: String -> Url
mkUrlUnsafe = (mkUrlImpl >>> unsafeFromForeign)

main :: Effect Unit
main = do
    testMkUrl
    testUrlMatch
    testDomain
    testHrefSansProtocol
    testHttp

testMkUrl :: Effect Unit
testMkUrl = do
    assertEqual { expected: Nothing, actual: mkUrl "" }
    assertEqual { expected: Nothing, actual: mkUrl "samhh.com" }
    let expectedUrl = { href: "https://samhh.com/", protocol: "https:", host: "samhh.com", hostname: "samhh.com", pathname: "/" }
    assertEqual { expected: Just expectedUrl, actual: mkUrl "https://samhh.com" }

testUrlMatch :: Effect Unit
testUrlMatch = do
    -- Ensure we're correctly interpreting the API
    assertGT $ compare 2 1

    assertGT $ compare Exact Domain
    assertGT $ compare Exact None
    assertGT $ compare Domain None
    assertEQ $ compare Exact Exact
    assertEQ $ compare Domain Domain
    assertEQ $ compare None None
    assertLT $ compare Domain Exact
    assertLT $ compare None Exact
    assertLT $ compare None Domain

testDomain :: Effect Unit
testDomain = do
    assertEqual { expected: "samhh.com", actual: domainFromHost "samhh.com" }
    assertEqual { expected: "samhh.com", actual: domainFromHost "sub.do.mains.samhh.com" }

testHrefSansProtocol :: Effect Unit
testHrefSansProtocol = do
    assertEqual { expected: "a.b.c.samhh.com/x/y/z.html", actual: hrefSansProtocol $ mkUrlUnsafe "https://a.b.c.samhh.com/x/y/z.html" }

testHttp :: Effect Unit
testHttp = do
    assert $ httpFromProtocol "http:"
    assert $ httpFromProtocol "https:"
    assert $ not $ httpFromProtocol "ftp:"

testCompare :: Effect Unit
testCompare = do
    assertEqual { expected: Exact, actual: URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "http://samhh.com") }
    assertEqual { expected: Exact, actual: URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://samhh.com") }
    assertEqual { expected: Exact, actual: URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.com") }
    assertEqual { expected: Domain, actual: URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.com/x/y/z") }
    assertEqual { expected: None, actual: URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.co.uk/x/y/z") }
    assertEqual { expected: None, actual: URL.compare (mkUrlUnsafe "ftp://samhh.com") (mkUrlUnsafe "ftp://samhh.com") }

