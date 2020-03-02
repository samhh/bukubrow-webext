module Test.QuickCheck.Gen.Custom where

import Prelude

import Data.Maybe (Maybe, fromJust, isJust)
import Partial.Unsafe (unsafePartial)
import Test.QuickCheck.Gen (Gen, suchThat)

-- | Generates a value for which the given function returns a 'Just', and then
-- | applies the function.
suchThatMap :: forall a b. Gen a -> (a -> Maybe b) -> Gen b
suchThatMap gen f = map (unsafePartial fromJust) $ map f gen `suchThat` isJust

