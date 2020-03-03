module Tab where

import Prelude

import Data.Array (elem)
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



