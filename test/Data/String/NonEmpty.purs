module Data.String.NonEmpty.Custom.Test where

import Prelude

import Data.Argonaut.Core (fromString)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Either (Either(..), isLeft)
import Data.String.NonEmpty (NonEmptyString, toString)
import Data.String.NonEmpty.Custom (NonEmptyStringN, mkNonEmptyStringN, startsWith)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Data.String.NonEmpty" do
    describe "NonEmptyStringN" do
        it "encodes non-empty strings" do
            quickCheck \(x :: NonEmptyString) -> encodeJson (mkNonEmptyStringN x) == fromString (toString x)
        it "decodes non-empty strings" do
            quickCheck \(x :: NonEmptyString) -> decodeJson (fromString (toString x)) === Right (toString x)
        it "does not decode empty string" do
            isLeft (decodeJson (fromString "") :: Either String NonEmptyStringN) `shouldEqual` true

    describe "startsWith" do
        it "matches identity" do
            quickCheck \(x :: NonEmptyString) -> startsWith x x
        it "matches starting with" do
            quickCheck \(x :: NonEmptyString) (y :: NonEmptyString) -> startsWith x (x <> y)
        it "does not match not starting with" do
            quickCheck \(x :: NonEmptyString) (y :: NonEmptyString) -> not $ startsWith x (y <> x)

