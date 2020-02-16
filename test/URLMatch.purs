module Test.App.URLMatch where

import Prelude

import App.URLMatch (URLMatch(..))
import Effect (Effect)
import Test.Utils (assertEQ, assertGT, assertLT)

main :: Effect Unit
main = do
    testURLMatch

testURLMatch :: Effect Unit
testURLMatch = do
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

