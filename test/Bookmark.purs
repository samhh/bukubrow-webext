module Bookmark.Test where

import Prelude

import Bookmark (localTags, remoteTags)
import Buku (bukuTagDelimiter, bukuTagDelimiterP, bukuTagDelimiterS)
import Data.Compactable (class Compactable, compact)
import Data.Foldable (any, foldr, length)
import Data.String (contains)
import Data.String as S
import Data.String.Custom as SS
import Data.String.Unsafe (charAt)
import Data.String.Utils (unsafeRepeat)
import Tag (Tag)
import Tag as Tag
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

m :: forall f. Functor f => Compactable f => f String -> f Tag
m = map Tag.fromString >>> compact

spec :: Spec Unit
spec = describe "Bookmark" do
    describe "localTags" do
        it """deserialises ignoring "empty" delimiters""" do
            localTags ""   `shouldEqual` []
            localTags ","  `shouldEqual` []
            localTags ",," `shouldEqual` []
            quickCheck \(n :: Int) -> localTags (unsafeRepeat (max 0 n) bukuTagDelimiterS) === []
        it "deserialises the same regardless of surrounding delimiters" do
            localTags "a,b"         `shouldEqual` m ["a", "b"]
            localTags "a,b,"        `shouldEqual` m ["a", "b"]
            localTags ",a,b"        `shouldEqual` m ["a", "b"]
            localTags ",a,b,"       `shouldEqual` m ["a", "b"]
            localTags ",,,a,,,b,,," `shouldEqual` m ["a", "b"]
        it "does not deserialise any tag with a delimiter" do
            quickCheck \(x :: String) -> not $ any (Tag.toString >>> contains bukuTagDelimiterP) $ localTags x

    describe "remoteTags" do
        it "serialises empty to a single delimiter as Buku does" do
            remoteTags [] `shouldEqual` ","
        it "serialises non-empty with surrounding delimiters" do
            remoteTags (m ["a"])      `shouldEqual` ",a,"
            remoteTags (m ["a", "b"]) `shouldEqual` ",a,b,"
        it "serialises to expected length" do
            let f = foldr (Tag.length >>> add) 0
            quickCheck \(xs :: Array Tag) -> S.length (remoteTags xs) === length xs + 1 + f xs
        it "always serialises with comma head" do
            quickCheck \(xs :: Array Tag) -> charAt 0 (remoteTags xs) === bukuTagDelimiter
        it "always serialises with comma last" do
            quickCheck \(xs :: Array Tag) -> charAt 0 (SS.reverse $ remoteTags xs) === bukuTagDelimiter

