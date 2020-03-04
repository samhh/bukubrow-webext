module Popup where

import Prelude

import Effect (Effect)

foreign import openPopup :: Effect Unit

foreign import closePopup :: Effect Unit

