module Test.Tab where

import Prelude

import Effect (Effect)
import Tab (isNewTabPage)
import Test.Assert (assert)

main :: Effect Unit
main = do
    testIsNewTabPage

testIsNewTabPage :: Effect Unit
testIsNewTabPage = do
    assert $ isNewTabPage { title: "", url: "about:blank" }
    assert $ not $ isNewTabPage { title: "", url: "about:xblank" }
    assert $ not $ isNewTabPage { title: "", url: "xabout:blank" }
    assert $ not $ isNewTabPage { title: "", url: "about:blankx" }
    assert $ isNewTabPage { title: "", url: "chrome://newtab/" }
    assert $ not $ isNewTabPage { title: "", url: "chrome://xnewtab/" }
    assert $ not $ isNewTabPage { title: "", url: "xchrome://newtab/" }
    assert $ not $ isNewTabPage { title: "", url: "chrome://newtab/x" }
    assert $ isNewTabPage { title: "New Tab", url: "" }
    assert $ not $ isNewTabPage { title: "NewxTab", url: "" }
    assert $ not $ isNewTabPage { title: "xNew Tab", url: "" }
    assert $ not $ isNewTabPage { title: "New Tabx", url: "" }
    assert $ isNewTabPage { title: "New Tab", url: "about:blank" }
    assert $ isNewTabPage { title: "New Tab", url: "chrome://newtab/" }
    assert $ not $ isNewTabPage { title: "", url: "" }


