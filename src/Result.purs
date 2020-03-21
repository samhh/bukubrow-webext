-- | `Result` is a simple sum type that expresses success or failure without
-- | any additional (meta)data attached. If `Either` is thought of as the type
-- | that expresses success or failure with (meta)data, and `Option` is the
-- | equivalent without any failure (meta)data, `Result` is the next step that
-- | can represent the success of an operation without any success (meta)data
-- | either.
-- |
-- | It's isomorphic to the primitive `Boolean` type, however it expresses
-- | additional/clearer semantic meaning.

module Result where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either, isRight)
import Data.Functor.Custom ((>#>))
import Data.Lens (Iso', iso, review, view)
import Data.Maybe (Maybe, isJust)

data Result
    = Success
    | Failure

instance encodeResult :: EncodeJson Result where
    encodeJson = view isoResult >>> encodeJson

instance decodeResult :: DecodeJson Result where
    decodeJson = decodeJson >#> review isoResult

isoResult :: Iso' Result Boolean
isoResult = iso to from
    where
        to :: Result -> Boolean
        to Success = true
        to Failure = false

        from :: Boolean -> Result
        from true  = Success
        from false = Failure

fromMaybe :: forall a. Maybe a -> Result
fromMaybe = isJust >>> review isoResult

fromEither :: forall a b. Either a b -> Result
fromEither = isRight >>> review isoResult

