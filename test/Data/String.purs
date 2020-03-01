module Data.String.Custom.Test where

import Prelude

import Data.Array as A
import Data.Natural (sign)
import Data.String (length)
import Data.String.CodeUnits (toCharArray)
import Data.String.Custom (repeat, reverse)
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
    describe "repeat" do
        it "returns empty string for zero" do
            repeat (sign 0) "x" `shouldEqual` ""
        it "repeats for naturals above zero" do
            repeat (sign 1) "x" `shouldEqual` "x"
            repeat (sign 3) "x" `shouldEqual` "xxx"
            quickCheck \(x :: String) -> length (repeat (sign 5) x) === length x * 5

