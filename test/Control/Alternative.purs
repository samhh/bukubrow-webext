module Test.Control.Alternative.Custom where

import Prelude

import Control.Alternative.Custom (ensure)
import Data.Maybe (Maybe, isJust)
import Effect (Effect)
import Test.Assert (assert)

main :: Effect Unit
main = do
    testEnsure

testEnsure :: Effect Unit
testEnsure = do
    assert $       isJust (ensure (const true ) 'x' :: Maybe Char)
    assert $ not $ isJust (ensure (const false) 'x' :: Maybe Char)

