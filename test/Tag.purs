module Tag.Test where

import Prelude

import Buku (tagDelimiter)
import Data.Lens (preview, review)
import Data.Maybe (isJust)
import Data.String.NonEmpty (NonEmptyString, contains)
import Tag (tagPrism)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Tag" do
    describe "tagPrism" do
        let f = preview tagPrism
        let g = review tagPrism
        it "accepts non-empty strings only without delimiter" do
            quickCheck \(x :: NonEmptyString) -> isJust (f x) === not (contains tagDelimiter x)

