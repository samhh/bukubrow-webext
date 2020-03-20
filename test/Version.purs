module Version.Test where

import Prelude

import Data.Lens (preview, review)
import Data.Maybe (Maybe(..))
import Data.Natural (Natural(..))
import Friendly (showf)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)
import Version (Version(..), versionArrNatPrism, versionStringPrism)

spec :: Spec Unit
spec = describe "Version" do
    describe "versionArrNatPrism" do
        let p = versionArrNatPrism
        let pre = preview p
        let re = review p

        it "abides review-preview law" do
            quickCheck \(x :: Version) -> pre (re x) === Just x

        it "parses array of correct length" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> pre [x, y, z] === Just (Version x y z)

        it "does not parse array with too few members" do
            quickCheck \(x :: Natural) (y :: Natural) -> pre [x, y] === Nothing

        it "does not parse array with too many members" do
            quickCheck \(w :: Natural) (x :: Natural) (y :: Natural) (z :: Natural) -> pre [w, x, y, z] === Nothing

    describe "versionStringPrism" do
        let p = versionStringPrism showf
        let pre = preview p
        let re = review p

        it "abides review-preview law" do
            quickCheck \(x :: Version) -> pre (re x) === Just x

        it "parses string" do
            pre "1.2.3" `shouldEqual` Just (Version (Natural 1) (Natural 2) (Natural 3))
            pre "0.15.3" `shouldEqual` Just (Version (Natural 0) (Natural 15) (Natural 3))
            pre "-1.15.3" `shouldEqual` Nothing

