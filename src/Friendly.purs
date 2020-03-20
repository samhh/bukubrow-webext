module Friendly where

import Prelude

class Friendly a where
    showf :: a -> String

instance friendlyString :: Friendly String where
    showf = identity

instance friendlyInt :: Friendly Int where
    showf = show

