module Bookmark.Test where

import Prelude

import Bookmark (LocalBookmark, isoLocalBookmarkD, localTags, remoteTags)
import Data.Compactable (class Compactable, compact)
import Data.Foldable (any, foldr, length)
import Data.Lens (review, view)
import Data.Natural (sign)
import Data.String (Pattern(..), contains)
import Data.String as S
import Data.String.Custom (repeat)
import Data.String.Custom as SS
import Data.String.NonEmpty (NonEmptyString, fromString, toString)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.CodeUnits (singleton)
import Data.String.Unsafe (charAt)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

m :: forall f. Functor f => Compactable f => f String -> f NonEmptyString
m = map fromString >>> compact

spec :: Spec Unit
spec = describe "Bookmark" do
    describe "isoLocalBookmarkD" do
        it "is very well-behaved / an isomorphism" do
            let n = singleton
            let b = {
                  id: 0
                , title: "abc"
                , desc: "xyz"
                , url: "https://samhh.com"
                , tags: [n 'c', n 'i', n 'a', n 'o']
                , flags: 0
                } :: LocalBookmark
            let f = view isoLocalBookmarkD
            let g = review isoLocalBookmarkD
            b `shouldEqual` g (f b)

    describe "localTags" do
        it """deserialises ignoring "empty" delimiters""" do
            localTags ""   `shouldEqual` []
            localTags ","  `shouldEqual` []
            localTags ",," `shouldEqual` []
            quickCheck \(n :: Int) -> localTags (repeat (sign n) ",") === []
        it "deserialises the same regardless of surrounding delimiters" do
            localTags "a,b"         `shouldEqual` m ["a", "b"]
            localTags "a,b,"        `shouldEqual` m ["a", "b"]
            localTags ",a,b"        `shouldEqual` m ["a", "b"]
            localTags ",a,b,"       `shouldEqual` m ["a", "b"]
            localTags ",,,a,,,b,,," `shouldEqual` m ["a", "b"]
        it "does not deserialise any tag with a comma" do
            quickCheck \(x :: String) -> not $ any (toString >>> contains (Pattern ",")) $ localTags x

    describe "remoteTags" do
        it "serialises empty to a single delimiter as Buku does" do
            remoteTags [] `shouldEqual` ","
        it "serialises non-empty with surrounding delimiters" do
            remoteTags (m ["a"])      `shouldEqual` ",a,"
            remoteTags (m ["a", "b"]) `shouldEqual` ",a,b,"
        it "serialises to expected length" do
            let f = foldr (NES.length >>> add) 0
            quickCheck \(xs :: Array NonEmptyString) -> S.length (remoteTags xs) === length xs + 1 + f xs
        it "always serialises with comma head" do
            quickCheck \(xs :: Array NonEmptyString) -> charAt 0 (remoteTags xs) === ','
        it "always serialises with comma last" do
            quickCheck \(xs :: Array NonEmptyString) -> charAt 0 (SS.reverse $ remoteTags xs) === ','

