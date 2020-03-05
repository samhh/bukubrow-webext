module Css.Test where

import Prelude

import Css (modifier)
import Halogen (ClassName(..))
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "CSS" do
    describe "modifier" do
        let f = ClassName
        let g (ClassName x) = x

        it "appends modifier if predicate holds" do
            quickCheck \(x :: String) (y :: String) -> g (modifier (f x) y (const true) unit) === x <> "--" <> y
        it "does not append modifier if predicate does not hold" do
            quickCheck \(x :: String) (y :: String) -> g (modifier (f x) y (const false) unit) === x

