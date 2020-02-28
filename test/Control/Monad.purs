module Control.Monad.Custom.Test where

import Prelude

import Control.Monad.Custom (filter)
import Data.Maybe (Maybe(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Control.Monad" do
    describe "filter" do
        it "maintains for true predicate" do
            filter (const true)  (Just 'x') `shouldEqual` Just 'x'
        it "empties for false predicate" do
            filter (const false) (Just 'x') `shouldEqual` Nothing

