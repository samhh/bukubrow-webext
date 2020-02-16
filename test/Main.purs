module Test.Main where

import Prelude

import Effect (Effect)
import Test.App.Bookmark as Bookmark
import Test.App.Tab as Tab

main :: Effect Unit
main = do
    Bookmark.main
    Tab.main

