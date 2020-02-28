module Data.String.Custom.Test where

import Prelude

import Data.Array as A
import Data.String.CodeUnits (toCharArray)
import Data.String.Custom (reverse)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Data.String" do
    describe "reverse" do
        it "works" do
            reverse "abc" `shouldEqual` "cba"
            quickCheck \(x :: String) -> A.reverse (toCharArray x) === toCharArray (reverse x)

