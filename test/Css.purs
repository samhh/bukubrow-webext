module Css.Test where

import Prelude

import Css (modifierM, modifierP)
import Data.Maybe (Maybe(..))
import Halogen (ClassName(..))
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "CSS" do
    let f = ClassName
    let g (ClassName x) = x

    describe "modifierM" do
        it "appends returned Just modifier" do
            quickCheck \(x :: String) (y :: String) -> (modifierM (f x) (const $ Just y) unit <#> g) === [x, x <> "--" <> y]
        it "does not append anything if Nothing returned" do
            quickCheck \(x :: String) (y :: String) -> (modifierM (f x) (const Nothing) unit <#> g) === [x]

    describe "modifierP" do
        it "appends modifier if predicate holds" do
            quickCheck \(x :: String) (y :: String) -> (modifierP (f x) y (const true) unit <#> g) === [x, x <> "--" <> y]
        it "does not append modifier if predicate does not hold" do
            quickCheck \(x :: String) (y :: String) -> (modifierP (f x) y (const false) unit <#> g) === [x]

