module Bookmarklet.Test where

import Prelude

import Bookmarklet (isBookmarklet, prefix)
import Data.String.NonEmpty.Internal (NonEmptyString)
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Bookmarklet" do
    describe "isBookmarklet" do
        it "accept any (non-empty) string starting with prefix" do
            quickCheck \(x :: NonEmptyString) -> isBookmarklet (prefix <> x)
        it "accept any (non-empty) string starting with prefix" do
            -- The chances of this generating the prefix are crazy low
            quickCheck \(x :: NonEmptyString) -> not $ isBookmarklet x


