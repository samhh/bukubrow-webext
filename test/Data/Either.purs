module Text.Data.Either.Custom where

import Prelude

import Data.Either (Either(..))
import Data.Either.Custom (fromLeft, fromRight)
import Effect (Effect)
import Test.Assert (assertEqual)

main :: Effect Unit
main = do
    testFromLeft
    testFromRight

testFromLeft :: Effect Unit
testFromLeft = do
    assertEqual $ { expected: 'x', actual: fromLeft 'x' (Right 'y') }
    assertEqual $ { expected: 'y', actual: fromLeft 'x' (Left 'y') }

testFromRight :: Effect Unit
testFromRight = do
    assertEqual $ { expected: 'x', actual: fromRight 'x' (Left 'y') }
    assertEqual $ { expected: 'y', actual: fromRight 'x' (Right 'y') }

