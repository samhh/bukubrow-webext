module Data.String.NonEmpty.Custom where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Decode.Error (JsonDecodeError(TypeMismatch))
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (note)
import Data.Function (on)
import Data.Functor.Custom ((>#>))
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, un)
import Data.String.NonEmpty (NonEmptyString)
import Data.String.NonEmpty as NES
import Data.String.Utils as SU
import Types (Predicate)

-- | A newtype wrapper intended exclusively for encoding/decoding, necessary
-- | to avoid creating an orphan instance.
newtype NonEmptyStringN = NonEmptyStringN NonEmptyString

derive instance newtypeNonEmptyStringN :: Newtype NonEmptyStringN _

instance showNonEmptyStringN :: Show NonEmptyStringN where
    show = toString

instance eqNonEmptyStringN :: Eq NonEmptyStringN where
    eq = eq `on` unNonEmptyStringN

instance encodeNonEmptyStringN :: EncodeJson NonEmptyStringN where
    encodeJson = toString >>> encodeJson

instance decodeNonEmptyStringN :: DecodeJson NonEmptyStringN where
    decodeJson = decodeJson >=> NES.fromString >#> mkNonEmptyStringN >>> note (TypeMismatch "Value is not a NonEmptyString")

mkNonEmptyStringN :: NonEmptyString -> NonEmptyStringN
mkNonEmptyStringN = NonEmptyStringN

unNonEmptyStringN :: NonEmptyStringN -> NonEmptyString
unNonEmptyStringN = un mkNonEmptyStringN

fromString :: String -> Maybe NonEmptyStringN
fromString = NES.fromString >#> mkNonEmptyStringN

toString :: NonEmptyStringN -> String
toString = unNonEmptyStringN >>> NES.toString

startsWith :: NonEmptyString -> Predicate NonEmptyString
startsWith = SU.startsWith `on` NES.toString

