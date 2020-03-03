module Control.Monad.Custom where

import Prelude

import Control.Alternative (class Alternative, empty)
import Types (Predicate)

filter :: forall m a. Monad m => Alternative m => Predicate a -> m a -> m a
filter p x = x >>= (\y -> if p y then pure y else empty)

