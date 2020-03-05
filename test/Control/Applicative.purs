module Control.Applicative.Custom.Test where

import Prelude

import Control.Applicative.Custom (ensure)
import Data.Maybe (Maybe(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Control.Applicative" do
    describe "ensure" do
        it "lifts if predicate holds" do
            ensure (const true)  'x' `shouldEqual` Just 'x'
        it "drops if predicate does not hold" do
            ensure (const false) 'x' `shouldEqual` Nothing

