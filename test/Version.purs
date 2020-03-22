module Version.Test where

import Prelude

import Data.Lens (preview, review)
import Data.Maybe (Maybe(..))
import Data.Natural (Natural(..), toInt)
import Friendly (showf)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)
import Version (Compatible(..), Outdated(..), Version(..), compat, fromSigned, versionArrNatPrism, versionStringPrism)

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

    describe "fromSigned" do
        it "signs and lifts" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> fromSigned (toInt x) (toInt y) (toInt z) === Version x y z
            fromSigned (-1) 1 0 `shouldEqual` Version (Natural 0) (Natural 1) (Natural 0)

    describe "compat" do
        let f = (_ + Natural 1)

        it "okays exact matches" do
            quickCheck \(x :: Version) -> compat x x === Compatible

        it "okays where second minor is newer" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version x y z) (Version x (f y) z) === Compatible

        it "okays where second patch is newer" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version x y z) (Version x y (f z)) === Compatible

        it "rejects first where its major is older" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version x y z) (Version (f x) y z) === Incompatible FirstOutdated

        it "rejects second where its major is older" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version (f x) y z) (Version x y z) === Incompatible SecondOutdated

        it "rejects second where its minor is older" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version x (f y) z) (Version x y z) === Incompatible SecondOutdated

        it "rejects second where its patch is older" do
            quickCheck \(x :: Natural) (y :: Natural) (z :: Natural) -> compat (Version x y (f z)) (Version x y z) === Incompatible SecondOutdated

