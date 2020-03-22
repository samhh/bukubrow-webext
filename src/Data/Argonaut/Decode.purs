module Data.Argonaut.Decode.Custom where

import Data.Argonaut.Core (Json)
import Data.Either (Either)

type Decoder a = Json -> Either String a

