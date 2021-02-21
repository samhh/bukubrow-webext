module Scroll where

import Prelude

import Effect (Effect)
import Web.HTML (HTMLElement)

foreign import windowScrollTo :: Number -> Number -> Effect Unit

foreign import scrollToEl :: (Number -> Number) -> HTMLElement -> Effect Unit

scrollToTop :: Effect Unit
scrollToTop = windowScrollTo 0.0 0.0

