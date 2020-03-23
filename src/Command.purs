module Command where

import Prelude

import Effect (Effect)

data Command
    = AddBookmark
    | StageAllTabs
    | StageWindowTabs
    | StageActiveTab

key :: Command -> String
key AddBookmark     = "add_bookmark"
key StageAllTabs    = "stage_all_tabs"
key StageWindowTabs = "stage_window_tabs"
key StageActiveTab  = "stage_active_tab"

foreign import onCommand :: (Effect Unit) -> Effect Unit

