module Test.Utils where

import Prelude

import Effect (Effect)
import Test.Assert (assertEqual)

main :: Effect Unit
main = do
    assertGT GT
    assertEQ EQ
    assertLT LT

assertOrdering :: Ordering -> Ordering -> Effect Unit
assertOrdering x y = assertEqual { expected: x, actual: y }

assertGT :: Ordering -> Effect Unit
assertGT = assertOrdering GT

assertEQ :: Ordering -> Effect Unit
assertEQ = assertOrdering EQ

assertLT :: Ordering -> Effect Unit
assertLT = assertOrdering LT

