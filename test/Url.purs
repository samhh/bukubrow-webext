module Test.App.Url where

import Prelude

import App.Url (UrlMatch(..))
import Effect (Effect)
import Test.Utils (assertEQ, assertGT, assertLT)

main :: Effect Unit
main = do
    testUrlMatch

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

