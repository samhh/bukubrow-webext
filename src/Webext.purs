module Webext where

import Prelude

import Control.Promise (Promise, toAff)
import Data.List (List, fromFoldable, head)
import Data.Maybe (Maybe)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)

type Tab =
    { title :: String
    , url :: String
    }

foreign import openPopup :: Effect Unit

foreign import closePopup :: Effect Unit

foreign import getActiveTabImpl :: Effect (Promise (Array Tab))

getActiveTab :: Unit -> Aff (Maybe Tab)
getActiveTab _ = liftEffect getActiveTabImpl >>= toAff >>> map (fromFoldable >>> head)

foreign import getActiveWindowTabsImpl :: Effect (Promise (Array Tab))

getActiveWindowTabs :: Unit -> Aff (List Tab)
getActiveWindowTabs _ = liftEffect getActiveWindowTabsImpl >>= toAff >>> map fromFoldable

foreign import getAllTabsImpl :: Effect (Promise (Array Tab))

getAllTabs :: Unit -> Aff (List Tab)
getAllTabs _ = liftEffect getAllTabsImpl >>= toAff >>> map fromFoldable

