module Search.Test where

import Prelude

import Data.Array.NonEmpty (fromArray)
import Data.Maybe (Maybe(..))
import Search (empty, parse)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Search" do
    describe "parse" do
        it "parses nothing for empty string" do
            parse "" `shouldEqual` empty
        it "parses name alone" do
            parse "abc" `shouldEqual` empty { name = Just "abc" }
            parse "abc xyz" `shouldEqual` empty { name = Just "abc xyz" }
        it "parses desc alone" do
            parse ">abc"          `shouldEqual` empty { desc = fromArray ["abc"] }
            parse ">abc xyz"      `shouldEqual` empty { desc = fromArray ["abc xyz"] }
            parse ">abc >xyz"     `shouldEqual` empty { desc = fromArray ["abc", "xyz"] }
            parse ">abc >xyz xyz" `shouldEqual` empty { desc = fromArray ["abc", "xyz xyz"] }
        it "parses url alone" do
            parse ":abc"          `shouldEqual` empty { url = fromArray ["abc"] }
            parse ":abc xyz"      `shouldEqual` empty { url = fromArray ["abc xyz"] }
            parse ":abc :xyz"     `shouldEqual` empty { url = fromArray ["abc", "xyz"] }
            parse ":abc :xyz xyz" `shouldEqual` empty { url = fromArray ["abc", "xyz xyz"] }
        it "parses tags alone" do
            parse "#abc"          `shouldEqual` empty { tags = fromArray ["abc"] }
            parse "#abc xyz"      `shouldEqual` empty { tags = fromArray ["abc xyz"] }
            parse "#abc #xyz"     `shouldEqual` empty { tags = fromArray ["abc", "xyz"] }
            parse "#abc #xyz xyz" `shouldEqual` empty { tags = fromArray ["abc", "xyz xyz"] }
        it "parses wildcard alone" do
            parse "*abc"          `shouldEqual` empty { wildcard = fromArray ["abc"] }
            parse "*abc xyz"      `shouldEqual` empty { wildcard = fromArray ["abc xyz"] }
            parse "*abc *xyz"     `shouldEqual` empty { wildcard = fromArray ["abc", "xyz"] }
            parse "*abc *xyz xyz" `shouldEqual` empty { wildcard = fromArray ["abc", "xyz xyz"] }
        it "parses multiple combined" do
            let expected = empty {
                  name = Just "name"
                , desc = fromArray ["desc1", "desc no2"]
                , url = fromArray ["url1", "url2"]
                , tags = fromArray ["tag1", "tag2", "tag3", "tag4"]
                , wildcard = fromArray ["wc1"]
                }
            parse "name #tag1 #tag2 #tag3 >desc1 :url1 >desc no2 *wc1 :url2 #tag4" `shouldEqual` expected
        it "parses edge cases predictably" do
            parse "a"         `shouldEqual` empty { name = Just "a" }
            parse "a :"       `shouldEqual` empty { name = Just "a :" }
            parse "a :u"      `shouldEqual` empty { name = Just "a", url = fromArray ["u"] }
            parse """a \:u""" `shouldEqual` empty { name = Just """a \:u""" }
            parse "a:a"       `shouldEqual` empty { name = Just "a:a" }
            parse "a:a :"     `shouldEqual` empty { name = Just "a:a :" }
            parse "a:a :u"    `shouldEqual` empty { name = Just "a:a", url = fromArray ["u"] }
            parse "aa"        `shouldEqual` empty { name = Just "aa" }
            parse " a :"      `shouldEqual` empty { name = Just " a :" }
            parse " a :u"     `shouldEqual` empty { name = Just " a", url = fromArray ["u"] }
            parse " :"        `shouldEqual` empty { name = Just " :" }
            parse " :u"       `shouldEqual` empty { url = fromArray ["u"] }
            parse " :u :"     `shouldEqual` empty { url = fromArray ["u"] }
            parse " :u :u"    `shouldEqual` empty { url = fromArray ["u", "u"] }

