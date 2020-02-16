module Test.Main where

import Prelude

import Effect (Effect)
import Test.App.Bookmark as Bookmark
import Test.App.Tab as Tab
import Test.App.Url as Url
import Test.Utils as Utils

main :: Effect Unit
main = do
    Utils.main

    Bookmark.main
    Tab.main
    Url.main

