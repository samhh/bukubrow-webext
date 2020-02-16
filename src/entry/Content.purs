module Content where

import Prelude

import App.Webext (getActiveTab, onTabActivity)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)

main :: Effect Unit
main = launchAff_ do
    (log <<< show) =<< getActiveTab unit
    liftEffect $ onTabActivity (log "TAB ACTIVITY WOO")

