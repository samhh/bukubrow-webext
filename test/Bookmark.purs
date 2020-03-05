module Bookmark.Test where

import Prelude

import Bookmark (Link(..), localTags, mkLink, remoteTags)
import Bookmarklet (Bookmarklet(..), prefix)
import Buku (tagDelimiter, tagDelimiterS)
import Data.Compactable (class Compactable, compact)
import Data.Foldable (any, foldr, length)
import Data.Maybe (fromJust)
import Data.String (contains)
import Data.String as S
import Data.String.Custom as SS
import Data.String.NonEmpty as NES
import Data.String.Unsafe (charAt)
import Data.String.Utils (unsafeRepeat)
import Partial.Unsafe (unsafePartial)
import Tag (Tag)
import Tag as Tag
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)
import Url as Url

m :: forall f. Functor f => Compactable f => f String -> f Tag
m = map Tag.fromString >>> compact

spec :: Spec Unit
spec = describe "Bookmark" do
    describe "mkLink" do
        it "makes bookmarklets" do
            quickCheck \(x :: String) -> do
                let y = (NES.toString prefix) <> x
                mkLink y === BookmarkletLink (Bookmarklet (NES.appendString prefix x))
        it "makes urls" do
            quickCheck \(x :: String) (tls :: Boolean) -> do
                let pc = if tls then "https:" else "http:"
                let y = pc <> "//samhh.com/" <> x
                mkLink y === UrlLink (unsafePartial fromJust (Url.fromString y))
        it "falls back to misc" do
            quickCheck \(x :: String) -> do
                let y = "ftp:" <> x
                mkLink y === MiscLink y

    describe "localTags" do
        it """deserialises ignoring "empty" delimiters""" do
            localTags ""   `shouldEqual` []
            localTags ","  `shouldEqual` []
            localTags ",," `shouldEqual` []
            quickCheck \(n :: Int) -> localTags (unsafeRepeat (max 0 n) tagDelimiterS) === []
        it "deserialises the same regardless of surrounding delimiters" do
            localTags "a,b"         `shouldEqual` m ["a", "b"]
            localTags "a,b,"        `shouldEqual` m ["a", "b"]
            localTags ",a,b"        `shouldEqual` m ["a", "b"]
            localTags ",a,b,"       `shouldEqual` m ["a", "b"]
            localTags ",,,a,,,b,,," `shouldEqual` m ["a", "b"]
        it "does not deserialise any tag with a delimiter" do
            quickCheck \(x :: String) -> not $ any (Tag.toString >>> contains tagDelimiter) $ localTags x

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
            quickCheck \(xs :: Array Tag) -> charAt 0 (remoteTags xs) === ','
        it "always serialises with comma last" do
            quickCheck \(xs :: Array Tag) -> charAt 0 (SS.reverse $ remoteTags xs) === ','

