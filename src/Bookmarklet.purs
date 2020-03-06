module Bookmarklet where

import Prelude

import Control.Applicative.Custom (ensure)
import Data.Function (on)
import Data.Functor.Custom ((>#>))
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Data.String.NonEmpty (NonEmptyString, nes)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Custom (startsWith)
import Data.Symbol (SProxy(..))
import Types (Predicate)

newtype Bookmarklet = Bookmarklet NonEmptyString

prefix :: NonEmptyString
prefix = nes (SProxy :: SProxy "javascript:")

isBookmarklet :: Predicate NonEmptyString
isBookmarklet = startsWith prefix

bookmarkletPrism :: Prism' NonEmptyString Bookmarklet
bookmarkletPrism = prism' (un Bookmarklet) (ensure isBookmarklet >#> Bookmarklet)

derive instance newtypeBookmarklet :: Newtype Bookmarklet _

instance showBookmarklet :: Show Bookmarklet where
    show = toString

instance eqBookmarklet :: Eq Bookmarklet where
    eq = eq `on` toNonEmptyString

fromNonEmptyString :: NonEmptyString -> Maybe Bookmarklet
fromNonEmptyString = preview bookmarkletPrism

fromString :: String -> Maybe Bookmarklet
fromString = NES.fromString >=> fromNonEmptyString

toNonEmptyString :: Bookmarklet -> NonEmptyString
toNonEmptyString = review bookmarkletPrism

toString :: Bookmarklet -> String
toString = toNonEmptyString >>> NES.toString

