module Data.Natural where

import Prelude

import Control.Applicative.Custom (ensure)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (note)
import Data.Functor.Custom ((>#>))
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Friendly (class Friendly)
import Types (Predicate)

newtype Natural = Natural Int

derive instance newtypeNatural :: Newtype Natural _

instance friendlyNatural :: Friendly Natural where
    showf = toInt >>> show

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

