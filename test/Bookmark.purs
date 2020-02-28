module Bookmark.Test where

import Prelude

import Bookmark (localTags, remoteTags)
import Data.Array (reverse)
import Data.Foldable (any, foldr, length)
import Data.String (Pattern(..), contains)
import Data.String as S
import Data.String.CodeUnits (fromCharArray, toCharArray)
import Data.String.Custom as SS
import Data.String.Unsafe (charAt)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "Bookmark" do
    describe "localTags" do
        it "deserialises ignoring \"empty\" delimiters" do
            localTags ""   `shouldEqual` []
            localTags ","  `shouldEqual` []
            localTags ",," `shouldEqual` []
        it "deserialises the same regardless of surrounding delimiters" do
            localTags "a,b"   `shouldEqual` ["a", "b"]
            localTags "a,b,"  `shouldEqual` ["a", "b"]
            localTags ",a,b"  `shouldEqual` ["a", "b"]
            localTags ",a,b," `shouldEqual` ["a", "b"]
        it "does not deserialise any tag with a comma" do
            quickCheck \(x :: String) -> not $ any (contains (Pattern ",")) $ localTags x

    describe "remoteTags" do
        it "serialises empty to a single delimiter as Buku does" do
            remoteTags [] `shouldEqual` ","
        it "serialises non-empty with surrounding delimiters" do
            remoteTags ["a"]      `shouldEqual` ",a,"
            remoteTags ["a", "b"] `shouldEqual` ",a,b,"
        it "serialises to expected length" do
            let f = foldr (S.length >>> add) 0
            quickCheck \(xs :: Array String) -> S.length (remoteTags xs) === length xs + 1 + f xs
        it "always serialises with comma head" do
            quickCheck \(xs :: Array String) -> charAt 0 (remoteTags xs) === ','
        it "always serialises with comma last" do
            quickCheck \(xs :: Array String) -> charAt 0 (SS.reverse $ remoteTags xs) === ','

