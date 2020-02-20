module Test.Main where

import Prelude

import Effect (Effect)
import Test.Bookmark as Bookmark
import Test.Tab as Tab
import Test.Url as Url
import Test.Utils as Utils

main :: Effect Unit
main = do
    Utils.main

    Bookmark.main
    Tab.main
    Url.main

