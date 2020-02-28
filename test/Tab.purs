module Tab.Test where

import Prelude

import Tab (isNewTabPage)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec = describe "Tab" do
    describe "isNewTabPage" do
        it "recognises new tab urls" do
            { title: "", url: "about:blank" }       `shouldSatisfy` isNewTabPage
            { title: "", url: "about:xblank" }      `shouldNotSatisfy` isNewTabPage
            { title: "", url: "xabout:blank" }      `shouldNotSatisfy` isNewTabPage
            { title: "", url: "about:blankx" }      `shouldNotSatisfy` isNewTabPage
            { title: "", url: "chrome://newtab/" }  `shouldSatisfy` isNewTabPage
            { title: "", url: "chrome://xnewtab/" } `shouldNotSatisfy` isNewTabPage
            { title: "", url: "xchrome://newtab/" } `shouldNotSatisfy` isNewTabPage
            { title: "", url: "chrome://newtab/x" } `shouldNotSatisfy` isNewTabPage
        it "recognises new tab titles" do
            { title: "New Tab", url: "" }  `shouldSatisfy` isNewTabPage
            { title: "NewxTab", url: "" }  `shouldNotSatisfy` isNewTabPage
            { title: "xNew Tab", url: "" } `shouldNotSatisfy` isNewTabPage
            { title: "New Tabx", url: "" } `shouldNotSatisfy` isNewTabPage
        it "recognises both new tab urls and titles" do
            { title: "New Tab", url: "about:blank" }      `shouldSatisfy` isNewTabPage
            { title: "New Tab", url: "chrome://newtab/" } `shouldSatisfy` isNewTabPage
            { title: "", url: "" }                        `shouldNotSatisfy` isNewTabPage

