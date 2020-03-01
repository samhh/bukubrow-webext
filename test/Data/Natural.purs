module Data.Natural.Test where

import Prelude

import Data.Natural (isNatural, sign, toInt)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Data.Natural" do
    describe "isNatural" do
        it "works" do
            isNatural (-1) `shouldEqual` false
            isNatural 0 `shouldEqual` true
            isNatural 1 `shouldEqual` true
            quickCheck \(x :: Int) -> isNatural x === x >= 0

    describe "sign" do
        it "wraps non-negative ints" do
            toInt (sign 0) `shouldEqual` 0
            toInt (sign 1) `shouldEqual` 1
        it "rounds negative ints to zero and wraps" do
            toInt (sign (-1)) `shouldEqual` 0

