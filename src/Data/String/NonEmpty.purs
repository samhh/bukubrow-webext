module Data.String.NonEmpty.Custom where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either, note)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Data.String.NonEmpty (NonEmptyString)
import Data.String.NonEmpty as NES

-- | A newtype wrapper intended exclusively for encoding/decoding, necessary
-- | to avoid creating an orphan instance.
newtype NonEmptyStringN = NonEmptyStringN NonEmptyString

derive instance newtypeNonEmptyStringN :: Newtype NonEmptyStringN _

instance showNonEmptyStringN :: Show NonEmptyStringN where
    show = toString

instance eqNonEmptyStringN :: Eq NonEmptyStringN where
    eq x y = unNonEmptyStringN x == unNonEmptyStringN y

instance encodeNonEmptyStringN :: EncodeJson NonEmptyStringN where
    encodeJson = toString >>> encodeJson

instance decodeNonEmptyStringN :: DecodeJson NonEmptyStringN where
    decodeJson json = do
        str <- decodeJson json :: Either String String
        note "Value is not a NonEmptyString" (NES.fromString str <#> mkNonEmptyStringN)

mkNonEmptyStringN :: NonEmptyString -> NonEmptyStringN
mkNonEmptyStringN = NonEmptyStringN

unNonEmptyStringN :: NonEmptyStringN -> NonEmptyString
unNonEmptyStringN = un mkNonEmptyStringN

fromString :: String -> Maybe NonEmptyStringN
fromString = NES.fromString >>> map mkNonEmptyStringN

toString :: NonEmptyStringN -> String
toString = unNonEmptyStringN >>> NES.toString

