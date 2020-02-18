module Test.App.Url where

import Prelude

import App.Url (mkUrl, UrlMatch(..), domainFromHost)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Test.Assert (assertEqual)
import Test.Utils (assertEQ, assertGT, assertLT)

main :: Effect Unit
main = do
    testMkUrl
    testUrlMatch
    testDomain

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

