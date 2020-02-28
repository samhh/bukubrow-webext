module Webext where

import Prelude

import Bookmarklet (Bookmarklet, unBookmarklet)
import Control.Promise (Promise, toAffE)
import Data.Array as A
import Data.Foldable (class Foldable)
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

foreign import createTabImpl :: String -> Effect (Promise Unit)

createTab :: String -> Aff Unit
createTab = createTabImpl >>> toAffE

foreign import updateActiveTabImpl :: String -> Effect (Promise Unit)

updateActiveTab :: String -> Aff Unit
updateActiveTab = updateActiveTabImpl >>> toAffE

activeTabIsNewTabPage :: Unit -> Aff Boolean
activeTabIsNewTabPage _ = getActiveTab unit <#> isNewTabPage

openBookmark :: String -> Aff Unit
openBookmark x = do
    y <- activeTabIsNewTabPage unit
    if y then updateActiveTab x else createTab x

openBookmarks :: forall f. Foldable f => f String -> Aff Unit
openBookmarks xs = do
    y <- activeTabIsNewTabPage unit
    sequence_ $ mapWithIndex (\i x -> open (y && i == 0) x) $ fromFoldable xs
        where
            open :: Boolean -> String -> Aff Unit
            open x y = if x then updateActiveTab y else createTab y

foreign import executeCodeInActiveTabImpl :: String -> Effect (Promise Unit)

executeCodeInActiveTab :: Bookmarklet -> Aff Unit
executeCodeInActiveTab = unBookmarklet >>> executeCodeInActiveTabImpl >>> toAffE

foreign import getSyncStorageImpl :: Array String -> Effect (Promise Foreign)

getSyncStorage :: forall f. Foldable f => f String -> Aff Foreign
getSyncStorage = A.fromFoldable >>> getSyncStorageImpl >>> toAffE

foreign import setSyncStorageImpl :: Foreign -> Effect (Promise Unit)

setSyncStorage :: Foreign -> Aff Unit
setSyncStorage = setSyncStorageImpl >>> toAffE

