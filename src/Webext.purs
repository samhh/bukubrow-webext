module Webext where

import Prelude

import Bookmarklet (Bookmarklet, unBookmarklet)
import Control.Promise (Promise, toAffE)
import Data.Array as A
import Data.List (List, fromFoldable, mapWithIndex)
import Data.Traversable (sequence_)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)
import Tab (Tab, isNewTabPage)

foreign import openPopup :: Effect Unit

foreign import closePopup :: Effect Unit

foreign import onTabActivity :: (Effect Unit) -> Effect Unit

foreign import getActiveTabImpl :: Effect (Promise Tab)

-- | Note that the active tab does not update very quickly, so this can't be
-- | relied upon in a loop
getActiveTab :: Unit -> Aff Tab
getActiveTab _ = toAffE getActiveTabImpl

foreign import getActiveWindowTabsImpl :: Effect (Promise (Array Tab))

getActiveWindowTabs :: Unit -> Aff (List Tab)
getActiveWindowTabs _ = toAffE getActiveWindowTabsImpl <#> fromFoldable

foreign import getAllTabsImpl :: Effect (Promise (Array Tab))

getAllTabs :: Unit -> Aff (List Tab)
getAllTabs _ = toAffE getAllTabsImpl <#> fromFoldable

