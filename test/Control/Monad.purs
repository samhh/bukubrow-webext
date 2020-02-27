module Test.Control.Monad.Custom where

import Prelude

import Control.Monad.Custom (filter)
import Data.Maybe (Maybe(..), isJust)
import Effect (Effect)
import Test.Assert (assert)

main :: Effect Unit
main = do
    testFilter

testFilter :: Effect Unit
testFilter = do
    assert $       isJust $ filter (const true ) (Just 'x')
    assert $ not $ isJust $ filter (const false) (Just 'x')

