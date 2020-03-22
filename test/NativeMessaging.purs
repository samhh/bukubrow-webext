module NativeMessaging.Test where

import Prelude

import Data.String (length, take)
import Effect.Exception (error)
import NativeMessaging (Error(..), err)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = describe "NativeMessaging" do
    describe "err" do
        it "detects host not found message" do
            let f = error >>> err
            let m = "host not found"

            quickCheck \(x :: String) -> f (x <> m)           === NoComms
            quickCheck \(x :: String) -> f (m <> x)           === NoComms
            quickCheck \(x :: String) -> f (x <> m <> x)      === NoComms
            quickCheck \(x :: String) -> f (x <> m <> x <> m) === NoComms

            f ""                        `shouldEqual` Unknown
            f (take ((length m) - 1) m) `shouldEqual` Unknown

