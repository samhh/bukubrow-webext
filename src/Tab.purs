module App.Tab where

import Prelude

import Data.List (elem, fromFoldable)

type Tab =
    { title :: String
    , url :: String
    }

isNewTabPage :: Tab -> Boolean
isNewTabPage x = knownNewTabUrl x.url || suspectedNewTabTitle x.title
    where
        knownNewTabUrl :: String -> Boolean
        knownNewTabUrl = flip elem $ fromFoldable [ "about:blank", "chrome://newtab/" ]

        -- | The href/url can change in some browsers if a new tab-changing extension
        -- | is in use, so this is a fallible test we can fall back to. As of time of
        -- | writing this is the default new tab page title in both Firefox and
        -- | Chromium
        suspectedNewTabTitle :: String -> Boolean
        suspectedNewTabTitle = (_ == "New Tab")



