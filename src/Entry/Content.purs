module Entry.Content where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Tab (getActiveTab, onTabActivity)

main :: Effect Unit
main = launchAff_ do
    getActiveTab unit >>= (show >>> log)
    liftEffect $ onTabActivity (log "TAB ACTIVITY WOO")

