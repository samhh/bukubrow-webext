module Data.Natural where

import Prelude

import Control.Applicative.Custom (ensure)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (note)
import Data.Function (on)
import Data.Functor.Custom ((>#>))
import Data.Int as Int
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Friendly (class Friendly)
import Test.QuickCheck (class Arbitrary, arbitrary)
import Test.QuickCheck.Gen.Custom (suchThatMap)
import Types (Predicate)

newtype Natural = Natural Int

derive instance newtypeNatural :: Newtype Natural _

instance showNatural :: Show Natural where
    show = toInt >>> show

instance friendlyNatural :: Friendly Natural where
    showf = show

instance eqNatural :: Eq Natural where
    eq = eq `on` toInt

instance ordNatural :: Ord Natural where
    compare = compare `on` toInt

instance semiringNatural :: Semiring Natural where
    zero = Natural 0
    one = Natural 1
    add x y = toInt x + toInt y # Natural
    mul x y = toInt x * toInt y # Natural

instance arbitraryNatural :: Arbitrary Natural where
    arbitrary = arbitrary `suchThatMap` fromInt

instance encodeNatural :: EncodeJson Natural where
    encodeJson = toInt >>> encodeJson

instance decodeNatural :: DecodeJson Natural where
    decodeJson = decodeJson >=> fromInt >>> note "Value is not a Natural"

isNatural :: Predicate Int
isNatural = (_ >= 0)

naturalPrism :: Prism' Int Natural
naturalPrism = prism' (un Natural) (ensure isNatural >#> Natural)

sign :: Int -> Natural
sign = max 0 >>> Natural

fromInt :: Int -> Maybe Natural
fromInt = preview naturalPrism

toInt :: Natural -> Int
toInt = review naturalPrism

fromString :: String -> Maybe Natural
fromString = Int.fromString >=> fromInt

