module SyncStorage where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Argonaut.Core (Json)
import Data.Array (fromFoldable)
import Data.Foldable (class Foldable)
import Effect (Effect)
import Effect.Aff (Aff)

foreign import getImpl :: Array String -> Effect (Promise Json)

get :: forall f. Foldable f => f String -> Aff Json
get = fromFoldable >>> getImpl >>> toAffE

foreign import setImpl :: Json -> Effect (Promise Unit)

set :: Json -> Aff Unit
set = setImpl >>> toAffE

