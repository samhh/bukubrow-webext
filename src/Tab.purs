module Tab where

import Prelude

import Bookmarklet (Bookmarklet, toString)
import Control.Promise (Promise, toAffE)
import Data.Array (elem, fromFoldable, mapWithIndex)
import Data.Foldable (class Foldable)
import Data.Traversable (sequence_)
import Effect (Effect)
import Effect.Aff (Aff)
import Types (Predicate)

type Tab =
    { title :: String
    , url :: String
    }

isNewTabPage :: Predicate Tab
isNewTabPage x = knownNewTabUrl x.url || suspectedNewTabTitle x.title
    where
        knownNewTabUrl :: Predicate String
        knownNewTabUrl = flip elem [ "about:blank", "chrome://newtab/" ]

        -- | The href/url can change in some browsers if a new tab-changing extension
        -- | is in use, so this is a fallible test we can fall back to. As of time of
        -- | writing this is the default new tab page title in both Firefox and
        -- | Chromium
        suspectedNewTabTitle :: Predicate String
        suspectedNewTabTitle = (_ == "New Tab")

foreign import onTabActivity :: (Effect Unit) -> Effect Unit

foreign import getActiveTabImpl :: Effect (Promise Tab)

-- | Note that the active tab does not update very quickly, so this can't be
-- | relied upon in a loop
getActiveTab :: Unit -> Aff Tab
getActiveTab _ = toAffE getActiveTabImpl

foreign import getActiveWindowTabsImpl :: Effect (Promise (Array Tab))

getActiveWindowTabs :: Unit -> Aff (Array Tab)
getActiveWindowTabs _ = toAffE getActiveWindowTabsImpl

foreign import getAllTabsImpl :: Effect (Promise (Array Tab))

getAllTabs :: Unit -> Aff (Array Tab)
getAllTabs _ = toAffE getAllTabsImpl

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
    activeTabEmpty <- activeTabIsNewTabPage unit
    if activeTabEmpty then updateActiveTab x else createTab x

openBookmarks :: forall f. Foldable f => f String -> Aff Unit
openBookmarks xs = do
    activeTabEmpty <- activeTabIsNewTabPage unit
    sequence_ $ mapWithIndex (\i -> open (activeTabEmpty && i == 0)) $ fromFoldable xs
        where
            open :: Boolean -> String -> Aff Unit
            open true = updateActiveTab
            open false = createTab

foreign import executeCodeInActiveTabImpl :: String -> Effect (Promise Unit)

executeCodeInActiveTab :: Bookmarklet -> Aff Unit
executeCodeInActiveTab = toString >>> executeCodeInActiveTabImpl >>> toAffE

