module SyncStorage where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Array (fromFoldable)
import Data.Foldable (class Foldable)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)

foreign import getSyncStorageImpl :: Array String -> Effect (Promise Foreign)

getSyncStorage :: forall f. Foldable f => f String -> Aff Foreign
getSyncStorage = fromFoldable >>> getSyncStorageImpl >>> toAffE

foreign import setSyncStorageImpl :: Foreign -> Effect (Promise Unit)

setSyncStorage :: Foreign -> Aff Unit
setSyncStorage = setSyncStorageImpl >>> toAffE

