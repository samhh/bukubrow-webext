module Control.Alternative.Custom.Test where

import Prelude

import Control.Alternative.Custom (ensure)
import Data.Maybe (Maybe(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Control.Alternative" do
    describe "ensure" do
        it "maintains for true predicate" do
            ensure (const true)  'x' `shouldEqual` Just 'x'
        it "empties for false predicate" do
            ensure (const false) 'x' `shouldEqual` Nothing

