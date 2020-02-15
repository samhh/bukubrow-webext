module Content where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import Webext (closePopup)

main :: Effect Unit
main = do
  log "hodor"
  closePopup

