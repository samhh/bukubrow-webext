module Content where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Webext (getActiveTab, onTabActivity)

main :: Effect Unit
main = launchAff_ do
    (log <<< show) =<< getActiveTab unit
    liftEffect $ onTabActivity (log "TAB ACTIVITY WOO")

