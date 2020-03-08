-- | Tags are non-empty strings without commas (Buku's internal delimiter).

module Tag where

import Prelude

import Buku (tagDelimiter)
import Control.Applicative.Custom (ensure)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (note)
import Data.Function (on)
import Data.Functor.Custom ((>#>))
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Data.String.NonEmpty (NonEmptyString, contains)
import Data.String.NonEmpty as NES
import Test.QuickCheck (class Arbitrary, arbitrary)
import Test.QuickCheck.Gen.Custom (suchThatMap)
import Types (Predicate)

newtype Tag = Tag NonEmptyString

isTag :: Predicate NonEmptyString
isTag = not $ contains tagDelimiter

tagPrism :: Prism' NonEmptyString Tag
tagPrism = prism' (un Tag) (ensure isTag >#> Tag)

derive instance newtypeTag :: Newtype Tag _

instance showTag :: Show Tag where
    show = toString

instance eqTag :: Eq Tag where
    eq = eq `on` toNonEmptyString

instance arbitraryTag :: Arbitrary Tag where
    arbitrary = arbitrary `suchThatMap` fromNonEmptyString

instance encodeTag :: EncodeJson Tag where
    encodeJson = toString >>> encodeJson

instance decodeTag :: DecodeJson Tag where
    decodeJson = decodeJson >=> fromString >>> note "Value is not a Tag"

fromNonEmptyString :: NonEmptyString -> Maybe Tag
fromNonEmptyString = preview tagPrism

fromString :: String -> Maybe Tag
fromString = NES.fromString >=> fromNonEmptyString

toNonEmptyString :: Tag -> NonEmptyString
toNonEmptyString = review tagPrism

toString :: Tag -> String
toString = toNonEmptyString >>> NES.toString

length :: Tag -> Int
length = toNonEmptyString >>> NES.length

