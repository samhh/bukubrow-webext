module Data.Argonaut.Decode.Custom where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Either (Either, hush)
import Data.Maybe (Maybe)

type Decoder a = Json -> Either String a

type Decoder' a = Json -> Maybe a

decodeJson' :: forall a. DecodeJson a => Decoder' a
decodeJson' = decodeJson >>> hush

