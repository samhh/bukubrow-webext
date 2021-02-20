module Data.String.Regex.Custom.Test where

import Prelude

import Data.Array.NonEmpty (fromArray)
import Data.String.Regex.Custom (matchAllFirstGroups)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Data.String.Regex" do
    describe "matchAllFirstGroups" do
        let r = unsafeRegex "(a.c)" global

        it "matches none" do
            matchAllFirstGroups r "ab" `shouldEqual` fromArray []
        it "matches one" do
            matchAllFirstGroups r "blah abc blah" `shouldEqual` fromArray ["abc"]
        it "matches many" do
            matchAllFirstGroups r "blah abc blah ayc blah" `shouldEqual` fromArray ["abc", "ayc"]
        it "does not match non-capture groups" do
            let r2 = unsafeRegex "(?:X)(a.c)" global
            matchAllFirstGroups r2 "blah Xabc blah" `shouldEqual` fromArray ["abc"]
        it "does not match other capture groups" do
            let r2 = unsafeRegex "(a.c)(X)" global
            matchAllFirstGroups r2 "blah abcX blah" `shouldEqual` fromArray ["abc"]

