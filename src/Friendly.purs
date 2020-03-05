module Friendly where

import Prelude

import Data.Version (Version, showVersion)

class Friendly a where
    showf :: a -> String

instance friendlyString :: Friendly String where
    showf = identity

instance friendlyInt :: Friendly Int where
    showf = show

instance friendlyVersion :: Friendly Version where
    showf = showVersion

