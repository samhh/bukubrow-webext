module SyncStorage where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Array (fromFoldable)
import Data.Foldable (class Foldable)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)

foreign import getImpl :: Array String -> Effect (Promise Foreign)

get :: forall f. Foldable f => f String -> Aff Foreign
get = fromFoldable >>> getImpl >>> toAffE

foreign import setImpl :: Foreign -> Effect (Promise Unit)

set :: Foreign -> Aff Unit
set = setImpl >>> toAffE

