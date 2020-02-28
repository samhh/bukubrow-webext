module Bookmark.Test where

import Prelude

import Bookmark (localTags, remoteTags)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Bookmark" do
    describe "localTags" do
        it "deserialises ignoring \"empty\" delimiters" do
            localTags ""   `shouldEqual` []
            localTags ","  `shouldEqual` []
            localTags ",," `shouldEqual` []
        it "deserialises the same regardless of surrounding delimiters" do
            localTags "a,b"   `shouldEqual` ["a", "b"]
            localTags "a,b,"  `shouldEqual` ["a", "b"]
            localTags ",a,b"  `shouldEqual` ["a", "b"]
            localTags ",a,b," `shouldEqual` ["a", "b"]

    describe "remoteTags" do
        it "serialises empty to a single delimiter as Buku does" do
            remoteTags [] `shouldEqual` ","
        it "serialises non-empty with surrounding delimiters" do
            remoteTags ["a"] `shouldEqual` ",a,"
            remoteTags ["a", "b"] `shouldEqual` ",a,b,"

