module Data.Either.Custom.Test where

import Prelude

import Data.Either (Either(..))
import Data.Either.Custom (fromLeft, fromRight)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Data.Either" do
    describe "fromLeft" do
        it "prefers preexisting Left value" do
            fromLeft 'x' (Left 'y')  `shouldEqual` 'y'
        it "takes fallback Left value" do
            fromLeft 'x' (Right 'y') `shouldEqual` 'x'

    describe "fromRight" do
        it "prefers preexisting Right value" do
            fromRight 'x' (Right 'y') `shouldEqual` 'y'
        it "takes fallback Right value" do
            fromRight 'x' (Left 'y')  `shouldEqual` 'x'

