module Content where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Webext (getActiveTab)

main :: Effect Unit
main = launchAff_ do
    (log <<< show) =<< getActiveTab unit

