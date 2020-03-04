module Webext where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Array (fromFoldable)
import Data.Foldable (class Foldable)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)

foreign import openPopup :: Effect Unit

foreign import closePopup :: Effect Unit

