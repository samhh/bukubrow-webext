module Data.String.Regex.Custom.Test where

import Prelude

import Data.Array.NonEmpty (fromArray)
import Data.String.Regex.Custom (matchAllFirstGroups)
import Data.String.Regex.Flags (global, noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Data.String.Regex" do
    describe "matchAllFirstGroups" do
        let r = unsafeRegex "(?:X)(a.c)"
        let rn = r noFlags
        let rg = r global

        it "matches none" do
            matchAllFirstGroups rg "abc" `shouldEqual` fromArray []
        it "matches one" do
            matchAllFirstGroups rg "blah Xabc blah" `shouldEqual` fromArray ["abc"]
        it "matches many" do
            matchAllFirstGroups rg "blah Xabc blah Xayc blah" `shouldEqual` fromArray ["abc", "ayc"]
        it "matches only first without global flag" do
            matchAllFirstGroups rn "blah Xabc blah Xayc blah" `shouldEqual` fromArray ["abc"]

