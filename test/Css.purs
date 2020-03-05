module CSS.Test where

import Prelude

import CSS (modifier)
import Data.Tuple (Tuple(..))
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "CSS" do
    describe "modifier" do
        it "appends modifier if predicate holds" do
            quickCheck \(x :: String) (y :: String) -> modifier (Tuple x y) (const true) unit === x <> "--" <> y
        it "does not append modifier if predicate does not hold" do
            quickCheck \(x :: String) (y :: String) -> modifier (Tuple x y) (const false) unit === x

