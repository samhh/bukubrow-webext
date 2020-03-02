module Bookmarklet where

import Prelude

import Control.Alternative.Custom (ensure)
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Data.String.NonEmpty (NonEmptyString, nes)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Custom (startsWith)
import Data.Symbol (SProxy(..))

newtype Bookmarklet = Bookmarklet NonEmptyString

prefix :: NonEmptyString
prefix = nes (SProxy :: SProxy "javascript:")

isBookmarklet :: NonEmptyString -> Boolean
isBookmarklet = startsWith prefix

bookmarkletPrism :: Prism' NonEmptyString Bookmarklet
bookmarkletPrism = prism' (un Bookmarklet) (ensure isBookmarklet >>> map Bookmarklet)

derive instance newtypeBookmarklet :: Newtype Bookmarklet _

instance showBookmarklet :: Show Bookmarklet where
    show = toString

instance eqBookmarklet :: Eq Bookmarklet where
    eq x y = toNonEmptyString x == toNonEmptyString y

fromNonEmptyString :: NonEmptyString -> Maybe Bookmarklet
fromNonEmptyString = preview bookmarkletPrism

fromString :: String -> Maybe Bookmarklet
fromString = NES.fromString >=> fromNonEmptyString

toNonEmptyString :: Bookmarklet -> NonEmptyString
toNonEmptyString = review bookmarkletPrism

toString :: Bookmarklet -> String
toString = toNonEmptyString >>> NES.toString

