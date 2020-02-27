module Control.Monad.Custom where

import Prelude

import Control.Alternative (class Alternative, empty)

filter :: forall m a. Monad m => Alternative m => (a -> Boolean) -> m a -> m a
filter p x = x >>= (\y -> if p y then pure y else empty)

