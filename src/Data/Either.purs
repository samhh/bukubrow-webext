module Data.Either.Custom where

import Prelude

import Data.Either (Either, either)

-- Hopefully these won't be needed eventually:
-- https://github.com/purescript/purescript-either/issues/47
fromLeft :: forall a b. a -> Either a b -> a
fromLeft x = either identity (const x)

fromRight :: forall a b. b -> Either a b -> b
fromRight x = either (const x) identity

